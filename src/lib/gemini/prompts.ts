/**
 * Prompt Templates for Vocabulary Generation
 *
 * Phase 03: Centralized prompt management for consistent AI responses
 */

import type { VocabGenerationRequest } from "@/types/vocabulary";

/**
 * Generate vocabulary definition prompt
 */
export function generateDefinitionPrompt(
  word: string,
  context?: string
): string {
  return `Provide a comprehensive definition for the word "${word}"${
    context ? ` in this context: "${context}"` : ""
  }.

Include:
1. Primary definition (clear and concise)
2. Secondary definitions if applicable
3. Part of speech
4. Phonetic pronunciation (IPA)
5. 2-3 example sentences showing different contexts
6. Usage notes (when to use it, register, formality)

Return as JSON:
{
  "text": "Primary definition",
  "examples": ["Example 1", "Example 2", "Example 3"]
}`;
}

/**
 * Generate collocations prompt
 */
export function generateCollocationsPrompt(word: string, partOfSpeech: string): string {
  return `Generate common collocations (word combinations) for "${word}" (${partOfSpeech}).

Provide 3-5 examples for each category:

1. Adjective + Noun (if noun): e.g., "strong coffee", "heavy rain"
2. Verb + Noun (if noun): e.g., "make a decision", "take action"
3. Noun + Preposition (if noun): e.g., "access to", "belief in"
4. Adverb + Adjective (if adjective): e.g., "really good", "very important"
5. Noun + Verb (if subject): e.g., "problems arise", "opportunities exist"
6. Verb + Adverb (if verb): e.g., "work effectively", "speak clearly"

Return only the relevant categories for this part of speech as JSON:
{
  "adjectiveNoun": ["example1", "example2"],
  "verbNoun": ["example1", "example2"],
  "nounPreposition": ["example1", "example2"],
  "adverbAdjective": ["example1", "example2"]
}`;
}

/**
 * Generate synonyms prompt
 */
export function generateSynonymsPrompt(word: string): string {
  return `Provide 5-8 synonyms for "${word}".

For each synonym, indicate:
1. The synonym word
2. Formality level: "formal", "neutral", or "informal"
3. Any nuance differences (optional)

Focus on commonly used synonyms. Avoid archaic or extremely rare words.

Return as JSON:
{
  "synonyms": [
    {"word": "synonym1", "formality": "formal"},
    {"word": "synonym2", "formality": "neutral"}
  ]
}`;
}

/**
 * Generate full vocabulary prompt (Phase 03 main prompt)
 */
export function generateFullPrompt(request: VocabGenerationRequest): string {
  const { seed, count, difficulty, language = "English" } = request;

  const difficultyGuidance = {
    beginner: "Use common, everyday words. Avoid specialized terminology.",
    intermediate: "Mix common and moderately advanced words. Include some academic/professional vocabulary.",
    advanced: "Include sophisticated, nuanced vocabulary. Academic, professional, and literary terms are appropriate.",
  };

  return `You are an expert vocabulary teacher for ${language} learners.

TASK: Generate ${count} vocabulary words based on this input: "${seed}"

DIFFICULTY LEVEL: ${difficulty}
${difficultyGuidance[difficulty]}

For EACH word, provide:

1. **Word**: Base form (lemmatized)
2. **Part of Speech**: noun, verb, adjective, adverb, or other
3. **Phonetic**: IPA pronunciation (e.g., /ˈwɜːrd/)
4. **Definitions**: Array of 2-3 definitions with context
   - text: Clear, concise definition
   - examples: 2-3 natural example sentences
5. **Collocations**: Common word combinations
   - adjectiveNoun: Adj + Noun pairs (if applicable)
   - verbNoun: Verb + Noun pairs (if applicable)
   - nounPreposition: Noun + Prep pairs (if applicable)
   - adverbAdjective: Adv + Adj pairs (if applicable)
6. **Synonyms**: 3-6 synonyms with formality level
   - word: synonym
   - formality: "formal" | "neutral" | "informal"
7. **Difficulty**: ${difficulty}

SELECTION CRITERIA:
- Words must be relevant to the input topic/context
- Prioritize high-frequency, useful vocabulary
- Include words that learners will encounter in real contexts
- Ensure variety in part of speech when possible
- Match the specified difficulty level

QUALITY STANDARDS:
- Examples must be natural, not contrived
- Collocations should be commonly used combinations
- Synonyms should have distinct meanings or formality levels
- Definitions should be clear and concise

OUTPUT FORMAT:
Return ONLY a valid JSON array. No markdown, no explanation, no additional text.

Example structure:
[
  {
    "word": "ephemeral",
    "partOfSpeech": "adjective",
    "phonetic": "/ɪˈfem(ə)rəl/",
    "definitions": [
      {
        "text": "Lasting for a very short time",
        "examples": [
          "Fame in the social media age is often ephemeral.",
          "The ephemeral beauty of cherry blossoms makes them special.",
          "Trends in fashion are increasingly ephemeral."
        ]
      }
    ],
    "collocations": {
      "adjectiveNoun": [],
      "verbNoun": [],
      "nounPreposition": [],
      "adverbAdjective": ["truly ephemeral", "remarkably ephemeral"]
    },
    "synonyms": [
      {"word": "transitory", "formality": "formal"},
      {"word": "fleeting", "formality": "neutral"},
      {"word": "short-lived", "formality": "neutral"},
      {"word": "temporary", "formality": "neutral"}
    ],
    "difficulty": "advanced"
  }
]

Generate ${count} words following this exact structure.`;
}

/**
 * Generate difficulty assessment prompt
 */
export function generateDifficultyPrompt(word: string): string {
  return `Assess the difficulty level of the vocabulary word "${word}" for English learners.

Consider:
- Frequency of use in everyday language
- Complexity of meaning
- Likelihood of encounter in common contexts

Return as JSON:
{
  "word": "${word}",
  "difficulty": "beginner|intermediate|advanced",
  "reasoning": "Brief explanation"
}`;
}

/**
 * Generate context-based word extraction prompt
 */
export function generateExtractionPrompt(text: string, count: number): string {
  return `Extract the ${count} most important vocabulary words from this text:

"${text}"

CRITERIA:
- Words that are essential for understanding the text
- Words that learners should add to their vocabulary
- Mix of academic/professional and general vocabulary
- Avoid extremely basic words (the, is, at, etc.)

For each word, provide:
1. The word
2. Part of speech
3. Context-specific definition
4. How it's used in the text
5. Difficulty level

Return as JSON array following the standard vocabulary structure.`;
}
