-- Migration 003: Create vocab_cache table
-- Phase 03: Cache generated vocabulary to reduce API costs

-- Create vocab_cache table
CREATE TABLE IF NOT EXISTS vocab_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seed TEXT NOT NULL UNIQUE,
  result JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  access_count INTEGER DEFAULT 1,
  last_accessed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_vocab_cache_seed ON vocab_cache(seed);
CREATE INDEX IF NOT EXISTS idx_vocab_cache_created_at ON vocab_cache(created_at);
CREATE INDEX IF NOT EXISTS idx_vocab_cache_last_accessed_at ON vocab_cache(last_accessed_at);

-- Enable Row Level Security
ALTER TABLE vocab_cache ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Anyone can read from cache (no authentication required for cache hits)
CREATE POLICY "Anyone can read vocab cache"
  ON vocab_cache
  FOR SELECT
  TO public
  USING (true);

-- Only authenticated users can insert into cache
CREATE POLICY "Authenticated users can insert vocab cache"
  ON vocab_cache
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only authenticated users can update cache (for access counting)
CREATE POLICY "Authenticated users can update vocab cache"
  ON vocab_cache
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add comments for documentation
COMMENT ON TABLE vocab_cache IS 'Cache for AI-generated vocabulary to reduce API costs';
COMMENT ON COLUMN vocab_cache.seed IS 'Normalized seed key (topic-text-count-difficulty-language)';
COMMENT ON COLUMN vocab_cache.result IS 'Generated vocabulary array as JSONB';
COMMENT ON COLUMN vocab_cache.access_count IS 'Number of times this cache entry has been accessed';
COMMENT ON COLUMN vocab_cache.last_accessed_at IS 'Timestamp of last access for cache pruning';

-- Create function to update access statistics on cache hit
CREATE OR REPLACE FUNCTION update_vocab_cache_access_stats()
RETURNS TRIGGER AS $$
BEGIN
  NEW.access_count = COALESCE(OLD.access_count, 0) + 1;
  NEW.last_accessed_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update access stats
-- Note: This trigger is optional since we update stats in application code
-- CREATE TRIGGER trigger_update_vocab_cache_access
--   AFTER UPDATE ON vocab_cache
--   FOR EACH ROW
--   WHEN (OLD.access_count IS DISTINCT FROM NEW.access_count)
--   EXECUTE FUNCTION update_vocab_cache_access_stats();
