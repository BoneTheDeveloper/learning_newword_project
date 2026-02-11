/**
 * Vocabulary Generation API Route
 *
 * POST /api/vocab/generate
 *
 * Generates vocabulary words using Gemini AI based on a seed (topic, text, or description).
 * Implements rate limiting and caching to reduce API costs.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  generateEnhancedVocabulary,
  checkRateLimit,
} from "@/lib/gemini/client";
import {
  getCachedVocab,
  setCachedVocab,
} from "@/lib/cache/vocab-cache";
import type {
  VocabGenerationRequest,
  GeneratedVocab,
} from "@/types/vocabulary";
import type { ApiResponse } from "@/types/vocabulary";

export const runtime = "nodejs";

/**
 * POST /api/vocab/generate
 *
 * Request body:
 * {
 *   "seed": string,           // Topic, text, or description
 *   "count": number,          // Number of words (1-20)
 *   "difficulty": "beginner" | "intermediate" | "advanced",
 *   "language": string        // Optional, default "English"
 * }
 *
 * Response:
 * {
 *   "data": GeneratedVocab[],
 *   "cached": boolean,
 *   "message": string
 * }
 */
export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json<ApiResponse<GeneratedVocab[]>>(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { seed, count = 10, difficulty = "intermediate", language = "English" } =
      body as VocabGenerationRequest;

    // Validate input
    if (!seed || typeof seed !== "string" || seed.trim().length === 0) {
      return NextResponse.json<ApiResponse<GeneratedVocab[]>>(
        { error: "Seed is required and must be a non-empty string." },
        { status: 400 }
      );
    }

    if (!count || count < 1 || count > 20) {
      return NextResponse.json<ApiResponse<GeneratedVocab[]>>(
        { error: "Count must be between 1 and 20." },
        { status: 400 }
      );
    }

    if (
      !difficulty ||
      !["beginner", "intermediate", "advanced"].includes(difficulty)
    ) {
      return NextResponse.json<ApiResponse<GeneratedVocab[]>>(
        { error: 'Difficulty must be "beginner", "intermediate", or "advanced".' },
        { status: 400 }
      );
    }

    // Check rate limit
    if (!checkRateLimit(user.id)) {
      return NextResponse.json<ApiResponse<GeneratedVocab[]>>(
        {
          error:
            "Rate limit exceeded. You can generate vocabulary 50 times per hour.",
        },
        { status: 429 }
      );
    }

    // Check cache
    const cacheKey = `${seed.trim().toLowerCase()}-${count}-${difficulty}-${language}`;
    const cached = await getCachedVocab(cacheKey);

    if (cached) {
      return NextResponse.json<ApiResponse<GeneratedVocab[]> & { cached: boolean }>(
        {
          data: cached as GeneratedVocab[],
          cached: true,
          message: "Vocabulary retrieved from cache.",
        },
        { status: 200 }
      );
    }

    // Generate vocabulary
    const request: VocabGenerationRequest = {
      seed: seed.trim(),
      count,
      difficulty,
      language,
    };

    const vocab = await generateEnhancedVocabulary(request);

    // Cache the result
    await setCachedVocab(cacheKey, vocab);

    return NextResponse.json<ApiResponse<GeneratedVocab[]> & { cached: boolean }>(
      {
        data: vocab,
        cached: false,
        message: `Successfully generated ${vocab.length} vocabulary words.`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in vocabulary generation API:", error);

    return NextResponse.json<ApiResponse<GeneratedVocab[]>>(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate vocabulary. Please try again.",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/vocab/generate
 *
 * Returns rate limit information for the current user.
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json<ApiResponse<{ rateLimit: number }>>(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // For now, return static rate limit info
    // In production, fetch actual usage from database/Redis
    return NextResponse.json<
      ApiResponse<{
        rateLimit: number;
        rateLimitWindow: string;
      }>
    >(
      {
        data: {
          rateLimit: 50,
          rateLimitWindow: "1 hour",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching rate limit info:", error);

    return NextResponse.json<ApiResponse<{ rateLimit: number }>>(
      { error: "Failed to fetch rate limit information." },
      { status: 500 }
    );
  }
}
