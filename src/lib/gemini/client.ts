/**
 * Gemini AI Client Wrapper
 *
 * Phase 03: Enhanced with JSON mode, rate limiting, and structured vocabulary generation
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import type {
  GeneratedWord,
  GenerationRequest,
  GeneratedVocab,
  VocabGenerationRequest,
} from "@/types/vocabulary";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Rate limiting: 50 requests per hour per user
const RATE_LIMIT_MAX = 50;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in ms

// User request tracking (in production, use Redis or database)
const userRequestCounts = new Map<string, { count: number; resetTime: number }>();

/**
 * Check rate limit for a user
 */
export function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const user_data = userRequestCounts.get(userId);

  if (!user_data || now > user_data.resetTime) {
    // Reset or initialize
    userRequestCounts.set(userId, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }

  if (user_data.count >= RATE_LIMIT_MAX) {
    return false;
  }

  user_data.count++;
  return true;
}

/**
 * Generate vocabulary words from a topic or text (Legacy)
 */
export async function generateVocabulary(
  request: GenerationRequest
): Promise<GeneratedWord[]> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const prompt = buildPrompt(request);

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the response
    const words = parseGeneratedWords(text);
    return words;
  } catch (error) {
    console.error("Error generating vocabulary:", error);
    throw new Error("Failed to generate vocabulary");
  }
}

/**
 * Generate enhanced vocabulary with JSON mode (Phase 03)
 */
export async function generateEnhancedVocabulary(
  request: VocabGenerationRequest
): Promise<GeneratedVocab[]> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const prompt = buildEnhancedPrompt(request);

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON response
    const vocab = JSON.parse(text) as GeneratedVocab[];
    return vocab;
  } catch (error) {
    console.error("Error generating enhanced vocabulary:", error);
    throw new Error("Failed to generate enhanced vocabulary");
  }
}

/**
 * Build the prompt for Gemini (Legacy)
 */
function buildPrompt(request: GenerationRequest): string {
  const { topic, text, count, difficulty, language = "English" } = request;

  let basePrompt = `You are a vocabulary teaching expert. Generate ${count} vocabulary words for ${language} learners.\n\n`;

  if (topic) {
    basePrompt += `Topic: ${topic}\n`;
  }

  if (text) {
    basePrompt += `Based on the following text, extract and explain key vocabulary words:\n\n"${text}"\n\n`;
  }

  basePrompt += `For each word, provide:
1. The word
2. Definition (clear and concise)
3. Part of speech
4. Pronunciation (IPA)
5. Example sentence (natural, contextual)
6. Context explanation (when and how to use it)
7. Mnemonics (memory aid, if applicable)
8. Difficulty level (easy, medium, or hard)

${difficulty ? `Target difficulty: ${difficulty}` : ""}

Return the response as a valid JSON array of objects with this exact structure:
[
  {
    "word": "example",
    "definition": "a representative form or pattern",
    "part_of_speech": "noun",
    "pronunciation": "/ɪɡˈzæmpəl/",
    "example_sentence": "This is an example of how the word is used.",
    "context": "Use this word when illustrating a concept with a specific instance.",
    "mnemonics": "EXAM + PLE = Think of taking an exam with a simple example.",
    "difficulty": "easy"
  }
]

Important: Return ONLY the JSON array, no additional text or explanation.`;

  return basePrompt;
}

/**
 * Build enhanced prompt with JSON schema (Phase 03)
 */
function buildEnhancedPrompt(request: VocabGenerationRequest): string {
  const { seed, count, difficulty, language = "English" } = request;

  return `You are an expert vocabulary teacher for ${language} learners.

Generate ${count} vocabulary words based on this input: "${seed}"

Difficulty level: ${difficulty}

For each word, provide:
1. The word (base form)
2. Part of speech (noun, verb, adjective, adverb, or other)
3. Phonetic pronunciation (IPA notation)
4. Definitions with context-specific examples (2-3 definitions per word)
5. Collocations grouped by type:
   - Adjective + Noun pairs (e.g., "strong coffee")
   - Verb + Noun pairs (e.g., "make a decision")
   - Noun + Preposition pairs (e.g., "access to")
   - Adverb + Adjective pairs (e.g., "really good")
6. Synonyms with formality level (formal, neutral, informal)
7. Difficulty rating (beginner, intermediate, advanced)

Requirements:
- Choose words relevant to the input topic/context
- Provide natural, commonly used collocations
- Include both formal and informal synonyms when applicable
- Examples should show real-world usage
- Match the requested difficulty level

Return ONLY valid JSON, no additional text.`;
}

/**
 * Parse generated words from Gemini response (Legacy)
 */
function parseGeneratedWords(text: string): GeneratedWord[] {
  try {
    // Try to extract JSON from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("No JSON array found in response");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate and map the response
    return parsed.map((item: unknown) => {
      const word = item as GeneratedWord;
      return {
        word: word.word,
        definition: word.definition,
        part_of_speech: word.part_of_speech,
        pronunciation: word.pronunciation,
        example_sentence: word.example_sentence,
        context: word.context,
        mnemonics: word.mnemonics,
        difficulty: word.difficulty || "medium",
      };
    });
  } catch (error) {
    console.error("Error parsing generated words:", error);
    throw new Error("Failed to parse generated vocabulary");
  }
}

/**
 * Generate a single word's detailed explanation
 */
export async function generateWordDetail(
  word: string,
  context?: string
): Promise<Omit<GeneratedWord, "word">> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const prompt = `Provide a detailed explanation for the word "${word}"${context ? ` in this context: "${context}"` : ""}.

Include:
1. Definition
2. Part of speech
3. Pronunciation (IPA)
4. Example sentence
5. Usage context
6. Mnemonics or memory aids
7. Difficulty level (easy, medium, hard)

Return as a JSON object (no array):
{
  "definition": "...",
  "part_of_speech": "...",
  "pronunciation": "...",
  "example_sentence": "...",
  "context": "...",
  "mnemonics": "...",
  "difficulty": "easy|medium|hard"
}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON object found in response");
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return parsed;
  } catch (error) {
    console.error("Error generating word detail:", error);
    throw new Error("Failed to generate word detail");
  }
}
