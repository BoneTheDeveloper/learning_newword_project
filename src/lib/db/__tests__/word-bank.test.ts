/**
 * Word Bank Database Layer Tests
 *
 * Phase 01: Unit tests for word_bank CRUD operations
 * Tests use mocked Supabase client - no actual database calls
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getWordByLemma,
  upsertWord,
  linkWordToTopics,
  type WordBankInsert,
} from "../word-bank";

// Mock Supabase client
vi.mock("@/lib/supabase/client", () => ({
  createClient: vi.fn(),
}));

// Import after mocking
import { createClient } from "@/lib/supabase/client";

// Mock Supabase client setup
const mockSupabase = {
  from: vi.fn(),
};

vi.mocked(createClient).mockReturnValue(mockSupabase as any);

beforeEach(() => {
  vi.clearAllMocks();
});

// ============================================================================
// Test Fixtures
// ============================================================================

const mockWord = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  word: "run",
  lemma: "run",
  definition: "To move at a speed faster than walking",
};

// ============================================================================
// Core CRUD Operations Tests
// ============================================================================

describe("word-bank: Core CRUD Operations", () => {
  describe("getWordByLemma", () => {
    it("should fetch word by lemma", async () => {
      const mockMaybeSingle = vi.fn().mockResolvedValue({
        data: mockWord,
        error: null,
      });

      const createIsChain = () => ({
        eq: createIsChain,
        maybeSingle: mockMaybeSingle,
      });

      const createEqChain = () => ({
        eq: createEqChain,
        is: createIsChain,
      });

      const mockSelect = vi.fn().mockReturnValue(createEqChain());

      mockSupabase.from.mockReturnValue({ select: mockSelect } as any);

      const result = await getWordByLemma("run");

      expect(result).toEqual(mockWord);
    });

    it("should return null when word not found", async () => {
      const mockMaybeSingle = vi.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      const createIsChain = () => ({
        eq: createIsChain,
        maybeSingle: mockMaybeSingle,
      });

      const createEqChain = () => ({
        eq: createEqChain,
        is: createIsChain,
      });

      const mockSelect = vi.fn().mockReturnValue(createEqChain());

      mockSupabase.from.mockReturnValue({ select: mockSelect } as any);

      const result = await getWordByLemma("nonexistent");

      expect(result).toBeNull();
    });

    it("should handle errors gracefully", async () => {
      const mockMaybeSingle = vi.fn().mockResolvedValue({
        data: null,
        error: { message: "Database error" },
      });

      const createIsChain = () => ({
        eq: createIsChain,
        maybeSingle: mockMaybeSingle,
      });

      const createEqChain = () => ({
        eq: createEqChain,
        is: createIsChain,
      });

      const mockSelect = vi.fn().mockReturnValue(createEqChain());

      mockSupabase.from.mockReturnValue({ select: mockSelect } as any);

      const result = await getWordByLemma("run");

      expect(result).toBeNull();
    });

    it("should use sense_id when provided", async () => {
      const mockMaybeSingle = vi.fn().mockResolvedValue({
        data: { ...mockWord, sense_id: "verb-1" },
        error: null,
      });

      // Create a chainable eq mock that returns itself
      const eqMock = vi.fn();
      const eqChain: any = {
        eq: eqMock,
        maybeSingle: mockMaybeSingle,
      };
      eqMock.mockReturnValue(eqChain);

      const mockSelect = vi.fn().mockReturnValue(eqChain);

      mockSupabase.from.mockReturnValue({ select: mockSelect } as any);

      const result = await getWordByLemma("run", "verb-1");

      expect(result).toBeDefined();
      expect(result?.sense_id).toBe("verb-1");
      expect(eqMock).toHaveBeenCalledTimes(3); // lemma_lower, language, sense_id
    });
  });
});

// ============================================================================
// CRUD Operations Tests
// ============================================================================

describe("word-bank: Upsert Word", () => {
  it("should upsert a word", async () => {
    const wordData: WordBankInsert = {
      word: "test",
      lemma: "test",
      definition: "A test definition",
      language: "en",
    };

    const mockSingle = vi.fn().mockResolvedValue({
      data: { ...mockWord, ...wordData },
      error: null,
    });

    const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
    const mockUpsert = vi.fn().mockReturnValue({ select: mockSelect });

    mockSupabase.from.mockReturnValue({ upsert: mockUpsert } as any);

    const result = await upsertWord(wordData);

    expect(result).toBeDefined();
    expect(result?.word).toBe("test");
    expect(mockUpsert).toHaveBeenCalledWith(wordData as never);
  });
});

// ============================================================================
// Topic Association Tests
// ============================================================================

describe("word-bank: Topic Association", () => {
  it("should link word to topics", async () => {
    const mockInsert = vi.fn().mockResolvedValue({ error: null });

    mockSupabase.from.mockReturnValue({ insert: mockInsert } as any);

    const result = await linkWordToTopics("word-id", ["sports", "fitness"], [80, 90]);

    expect(result).toBe(true);
    expect(mockInsert).toHaveBeenCalledWith([
      { word_id: "word-id", topic_slug: "sports", relevance_score: 80 },
      { word_id: "word-id", topic_slug: "fitness", relevance_score: 90 },
    ]);
  });

  it("should default relevance score to 50", async () => {
    const mockInsert = vi.fn().mockResolvedValue({ error: null });

    mockSupabase.from.mockReturnValue({ insert: mockInsert } as any);

    await linkWordToTopics("word-id", ["sports"]);

    expect(mockInsert).toHaveBeenCalledWith([
      { word_id: "word-id", topic_slug: "sports", relevance_score: 50 },
    ]);
  });

  it("should handle insert errors", async () => {
    const mockInsert = vi.fn().mockResolvedValue({
      error: { message: "Insert failed" },
    });

    mockSupabase.from.mockReturnValue({ insert: mockInsert } as any);

    const result = await linkWordToTopics("word-id", ["sports"]);

    expect(result).toBe(false);
  });
});
