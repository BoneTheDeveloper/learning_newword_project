/**
 * Application Types for VocabBuilder
 */

import { Database } from "./database";

// Supabase row types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Collection = Database["public"]["Tables"]["collections"]["Row"];
export type Vocabulary = Database["public"]["Tables"]["vocabulary"]["Row"];
export type StudySession = Database["public"]["Tables"]["study_sessions"]["Row"];
export type StudyProgress = Database["public"]["Tables"]["study_progress"]["Row"];

// SRS Response types
export type SrsResponse = "again" | "hard" | "good" | "easy";

// Difficulty types
export type Difficulty = "easy" | "medium" | "hard";

// Word status derived from SRS stage
export type WordStatus = "new" | "learning" | "review" | "mastered";

// Extended vocabulary type with progress
export interface VocabularyWithProgress extends Vocabulary {
  progress?: StudyProgress;
  status?: WordStatus;
}

// User stats
export interface UserStats {
  totalWords: number;
  wordsDue: number;
  streakDays: number;
  retentionRate: number;
  reviewsToday: number;
}

// AI Generation types
export interface GeneratedWord {
  word: string;
  definition: string;
  part_of_speech: string;
  pronunciation?: string;
  example_sentence: string;
  context: string;
  mnemonics?: string;
  difficulty: Difficulty;
}

export interface GenerationRequest {
  topic?: string;
  text?: string;
  count: number;
  difficulty?: Difficulty;
  language?: string;
}

// Phase 03: Enhanced Vocabulary Generation Types
export type PartOfSpeech = 'noun' | 'verb' | 'adjective' | 'adverb' | 'other';

export interface GeneratedVocab {
  word: string;
  partOfSpeech: PartOfSpeech;
  phonetic?: string;
  definitions: Definition[];
  collocations: Collocations;
  synonyms: Synonym[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface Definition {
  text: string;
  examples: string[];
}

export interface Collocations {
  adjectiveNoun: string[];
  verbNoun: string[];
  nounPreposition: string[];
  adverbAdjective: string[];
}

export interface Synonym {
  word: string;
  formality: 'formal' | 'neutral' | 'informal';
}

export interface VocabGenerationRequest {
  seed: string; // Topic, text, or description
  count: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language?: string;
}

// Study session types
export interface StudyCard {
  id: string;
  vocabulary: VocabularyWithProgress;
  isDue: boolean;
}

export interface StudySessionState {
  cards: StudyCard[];
  currentIndex: number;
  correctAnswers: number;
  startTime: Date;
}

// Auth types
export interface SignUpData {
  email: string;
  password: string;
  fullName?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

// API response types
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

// Form types
export interface CollectionForm {
  name: string;
  description?: string;
  color?: string;
}

export interface VocabularyForm {
  word: string;
  definition: string;
  part_of_speech?: string;
  pronunciation?: string;
  example_sentence?: string;
  context?: string;
  mnemonics?: string;
  difficulty: Difficulty;
  collection_id?: string;
}

// Phase 04: Card and Collection Types

/**
 * Saved Card - A vocabulary card saved to the database
 */
export interface SavedCard {
  id: string;
  user_id: string;
  word: string;
  part_of_speech: string | null;
  phonetic: string | null;
  definitions: Definition[];
  collocations: Collocations | null;
  synonyms: Synonym[] | null;
  difficulty: string | null;
  context: string | null;
  created_at: string;
  updated_at: string;
  collections?: CardCollectionRef[];
}

/**
 * Reference to a collection that a card belongs to
 */
export interface CardCollectionRef {
  collection_id: string;
  name: string | null;
}

/**
 * Extended Collection with stats
 */
export interface CollectionWithStats extends Collection {
  card_count: number;
  due_count?: number;
}

/**
 * Filters for card listing
 */
export interface CardFilters {
  search?: string;
  difficulty?: string;
  part_of_speech?: string;
  collection_id?: string;
  sort_by?: "created_at" | "word" | "difficulty";
  sort_order?: "asc" | "desc";
}

/**
 * View mode for card display
 */
export type CardViewMode = "grid" | "list";

/**
 * Selection mode for cards
 */
export type SelectionMode = "single" | "multiple";
