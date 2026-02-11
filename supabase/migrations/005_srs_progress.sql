-- SRS Progress Tracking Table
-- Tracks the spaced repetition progress for each saved card

CREATE TABLE IF NOT EXISTS srs_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- SM-2 Algorithm Parameters
  ease_factor DECIMAL(3, 2) NOT NULL DEFAULT 2.5,
  interval_days INTEGER NOT NULL DEFAULT 0,
  repetitions INTEGER NOT NULL DEFAULT 0,

  -- Review Scheduling
  next_review_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  last_review_at TIMESTAMP WITH TIME ZONE,

  -- Statistics
  total_reviews INTEGER NOT NULL DEFAULT 0,
  correct_reviews INTEGER NOT NULL DEFAULT 0,
  incorrect_reviews INTEGER NOT NULL DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

  -- Constraints
  UNIQUE(card_id, user_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_srs_progress_user_next_review ON srs_progress(user_id, next_review_at);
CREATE INDEX IF NOT EXISTS idx_srs_progress_card_id ON srs_progress(card_id);
CREATE INDEX IF NOT EXISTS idx_srs_progress_next_review ON srs_progress(next_review_at);

-- Enable Row Level Security
ALTER TABLE srs_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own SRS progress
CREATE POLICY "Users can view own SRS progress"
  ON srs_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own SRS progress"
  ON srs_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own SRS progress"
  ON srs_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own SRS progress"
  ON srs_progress FOR DELETE
  USING (auth.uid() = user_id);

-- Study Sessions Table
-- Tracks completed study sessions for statistics

CREATE TABLE IF NOT EXISTS study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Session Details
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,

  -- Statistics
  cards_reviewed INTEGER NOT NULL DEFAULT 0,
  cards_correct INTEGER NOT NULL DEFAULT 0,

  -- Optional: Collection ID if session was for a specific collection
  collection_id UUID REFERENCES collections(id) ON DELETE SET NULL,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

  -- Constraints
  CHECK (cards_reviewed >= 0)
  CHECK (cards_correct >= 0)
  CHECK (cards_correct <= cards_reviewed)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_id ON study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_started_at ON study_sessions(started_at);
CREATE INDEX IF NOT EXISTS idx_study_sessions_collection_id ON study_sessions(collection_id);

-- Enable Row Level Security
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own study sessions
CREATE POLICY "Users can view own study sessions"
  ON study_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own study sessions"
  ON study_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own study sessions"
  ON study_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to automatically initialize SRS progress for new cards
CREATE OR REPLACE FUNCTION initialize_srs_progress_for_card()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO srs_progress (card_id, user_id)
  VALUES (NEW.id, NEW.user_id)
  ON CONFLICT (card_id, user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-create SRS progress when a card is created
CREATE TRIGGER initialize_srs_progress_trigger
  AFTER INSERT ON cards
  FOR EACH ROW
  EXECUTE FUNCTION initialize_srs_progress_for_card();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_srs_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_srs_progress_updated_at_trigger
  BEFORE UPDATE ON srs_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_srs_progress_updated_at();

-- Function to get cards due for review
CREATE OR REPLACE FUNCTION get_due_cards(p_user_id UUID, p_limit INTEGER DEFAULT 50)
RETURNS TABLE (
  card_id UUID,
  word TEXT,
  ease_factor DECIMAL,
  interval_days INTEGER,
  repetitions INTEGER,
  next_review_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    srs.card_id,
    c.word,
    srs.ease_factor,
    srs.interval_days,
    srs.repetitions,
    srs.next_review_at
  FROM srs_progress srs
  JOIN cards c ON c.id = srs.card_id
  WHERE srs.user_id = p_user_id
    AND srs.next_review_at <= NOW()
  ORDER BY srs.next_review_at ASC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_due_cards(UUID, INTEGER) TO authenticated;
