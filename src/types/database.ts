/**
 * Supabase Database Types
 * Generated from Supabase schema
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      collections: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          color: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          color?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          color?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      vocabulary: {
        Row: {
          id: string;
          user_id: string;
          collection_id: string | null;
          word: string;
          definition: string;
          part_of_speech: string | null;
          pronunciation: string | null;
          example_sentence: string | null;
          context: string | null;
          mnemonics: string | null;
          difficulty: "easy" | "medium" | "hard";
          source: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          collection_id?: string | null;
          word: string;
          definition: string;
          part_of_speech?: string | null;
          pronunciation?: string | null;
          example_sentence?: string | null;
          context?: string | null;
          mnemonics?: string | null;
          difficulty?: "easy" | "medium" | "hard";
          source?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          collection_id?: string | null;
          word?: string;
          definition?: string;
          part_of_speech?: string | null;
          pronunciation?: string | null;
          example_sentence?: string | null;
          context?: string | null;
          mnemonics?: string | null;
          difficulty?: "easy" | "medium" | "hard";
          source?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      study_sessions: {
        Row: {
          id: string;
          user_id: string;
          started_at: string;
          completed_at: string | null;
          cards_reviewed: number;
          correct_answers: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          started_at?: string;
          completed_at?: string | null;
          cards_reviewed?: number;
          correct_answers?: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          started_at?: string;
          completed_at?: string | null;
          cards_reviewed?: number;
          correct_answers?: number;
        };
      };
      study_progress: {
        Row: {
          id: string;
          user_id: string;
          vocabulary_id: string;
          srs_stage: number;
          ease_factor: number;
          interval_minutes: number;
          next_review_at: string;
          last_reviewed_at: string | null;
          total_reviews: number;
          correct_reviews: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          vocabulary_id: string;
          srs_stage?: number;
          ease_factor?: number;
          interval_minutes?: number;
          next_review_at: string;
          last_reviewed_at?: string | null;
          total_reviews?: number;
          correct_reviews?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          vocabulary_id?: string;
          srs_stage?: number;
          ease_factor?: number;
          interval_minutes?: number;
          next_review_at?: string;
          last_reviewed_at?: string | null;
          total_reviews?: number;
          correct_reviews?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      cards: {
        Row: {
          id: string;
          user_id: string;
          word: string;
          part_of_speech: string | null;
          phonetic: string | null;
          definitions: Json;
          collocations: Json | null;
          synonyms: Json | null;
          difficulty: string | null;
          context: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          word: string;
          part_of_speech?: string | null;
          phonetic?: string | null;
          definitions: Json;
          collocations?: Json | null;
          synonyms?: Json | null;
          difficulty?: string | null;
          context?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          word?: string;
          part_of_speech?: string | null;
          phonetic?: string | null;
          definitions?: Json;
          collocations?: Json | null;
          synonyms?: Json | null;
          difficulty?: string | null;
          context?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      card_collections: {
        Row: {
          card_id: string;
          collection_id: string;
        };
        Insert: {
          card_id: string;
          collection_id: string;
        };
        Update: {
          card_id?: string;
          collection_id?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Convenience types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Collection = Database["public"]["Tables"]["collections"]["Row"];
export type Vocabulary = Database["public"]["Tables"]["vocabulary"]["Row"];
export type StudySession = Database["public"]["Tables"]["study_sessions"]["Row"];
export type StudyProgress = Database["public"]["Tables"]["study_progress"]["Row"];

// Phase 04: Card and Collection types
export type Card = Database["public"]["Tables"]["cards"]["Row"];
export type CardCollection = Database["public"]["Tables"]["card_collections"]["Row"];

// Card with collection associations
export interface CardWithCollections extends Card {
  collections: Array<{ collection_id: string; name: string }>;
}
