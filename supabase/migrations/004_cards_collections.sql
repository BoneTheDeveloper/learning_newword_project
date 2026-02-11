-- Phase 04: Cards and Collections Migration
-- Creates tables for storing vocabulary cards and organizing them into collections

-- Cards table (vocabulary items)
CREATE TABLE cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  word TEXT NOT NULL,
  part_of_speech TEXT,
  phonetic TEXT,
  definitions JSONB NOT NULL,
  collocations JSONB,
  synonyms JSONB,
  difficulty TEXT,
  context TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Collections table (organize cards into groups)
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Card-Collection junction table
CREATE TABLE card_collections (
  card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  PRIMARY KEY (card_id, collection_id)
);

-- Indexes for performance
CREATE INDEX idx_cards_user_id ON cards(user_id);
CREATE INDEX idx_cards_word ON cards(word);
CREATE INDEX idx_cards_created_at ON cards(created_at);
CREATE INDEX idx_cards_difficulty ON cards(difficulty);
CREATE INDEX idx_collections_user_id ON collections(user_id);
CREATE INDEX idx_collections_name ON collections(name);
CREATE INDEX idx_card_collections_card_id ON card_collections(card_id);
CREATE INDEX idx_card_collections_collection_id ON card_collections(collection_id);

-- Enable Row Level Security
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_collections ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Cards
CREATE POLICY "Users can view own cards" ON cards
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cards" ON cards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cards" ON cards
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cards" ON cards
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Collections
CREATE POLICY "Users can view own collections" ON collections
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own collections" ON collections
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own collections" ON collections
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own collections" ON collections
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Card_Collections
CREATE POLICY "Users can view card_collections" ON card_collections
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM cards
      WHERE cards.id = card_collections.card_id
      AND cards.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert card_collections" ON card_collections
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM cards
      WHERE cards.id = card_collections.card_id
      AND cards.user_id = auth.uid()
    )
    AND EXISTS (
      SELECT 1 FROM collections
      WHERE collections.id = card_collections.collection_id
      AND collections.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete card_collections" ON card_collections
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM cards
      WHERE cards.id = card_collections.card_id
      AND cards.user_id = auth.uid()
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to auto-update updated_at
CREATE TRIGGER update_cards_updated_at
  BEFORE UPDATE ON cards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collections_updated_at
  BEFORE UPDATE ON collections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
