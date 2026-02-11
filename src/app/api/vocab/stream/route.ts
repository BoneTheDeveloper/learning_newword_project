/**
 * Vocabulary Streaming API Route
 *
 * POST /api/vocab/stream
 *
 * Streams vocabulary generation progress using Server-Sent Events (SSE).
 * Provides real-time feedback during AI generation.
 */

import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/gemini/client";
import {
  getCachedVocab,
  setCachedVocab,
} from "@/lib/cache/vocab-cache";
import type { VocabGenerationRequest, GeneratedVocab } from "@/types/vocabulary";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

/**
 * POST /api/vocab/stream
 *
 * Streams generation progress via SSE.
 */
export async function POST(req: NextRequest) {
  // Authenticate user
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Parse request body
  const body = await req.json();
  const { seed, count = 10, difficulty = "intermediate", language = "English" } =
    body as VocabGenerationRequest;

  // Validate input
  if (!seed || typeof seed !== "string" || seed.trim().length === 0) {
    return new Response("Invalid seed", { status: 400 });
  }

  if (!count || count < 1 || count > 20) {
    return new Response("Invalid count", { status: 400 });
  }

  // Check rate limit
  if (!checkRateLimit(user.id)) {
    return new Response("Rate limit exceeded", { status: 429 });
  }

  // Check cache
  const cacheKey = `${seed.trim().toLowerCase()}-${count}-${difficulty}-${language}`;
  const cached = await getCachedVocab(cacheKey);

  if (cached) {
    // Return cached result immediately
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "cached", data: cached })}\n\n`)
        );
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }

  // Create SSE stream
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Send start event
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "start" })}\n\n`)
        );

        // Initialize Gemini
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({
          model: "gemini-2.5-flash",
          generationConfig: {
            responseMimeType: "application/json",
          },
        });

        // Build prompt
        const prompt = `You are an expert vocabulary teacher for ${language} learners.

Generate ${count} vocabulary words based on this input: "${seed}"

Difficulty level: ${difficulty}

For each word, provide word, partOfSpeech, phonetic, definitions (with text and examples), collocations, synonyms, and difficulty.

Return ONLY valid JSON array, no additional text.`;

        // Generate content
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Parse result
        const vocab = JSON.parse(text) as GeneratedVocab[];

        // Cache result
        await setCachedVocab(cacheKey, vocab);

        // Send progress event
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "progress", percent: 100 })}\n\n`)
        );

        // Send complete event
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "complete", data: vocab })}\n\n`)
        );

        // Send done event
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (error) {
        console.error("Stream error:", error);
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "error", message: "Generation failed" })}\n\n`
          )
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
