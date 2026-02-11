/**
 * Vocabulary Cache Library
 *
 * Phase 03: Supabase-based caching for generated vocabulary
 * Reduces API costs by storing and reusing generation results.
 */

import { createClient } from "@/lib/supabase/server";
import type { GeneratedVocab } from "@/types/vocabulary";

const CACHE_TABLE = "vocab_cache";

/**
 * Get cached vocabulary by seed
 */
export async function getCachedVocab(
  seed: string
): Promise<GeneratedVocab[] | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from(CACHE_TABLE)
      .select("result, access_count, last_accessed_at")
      .eq("seed", seed)
      .single();

    if (error || !data) {
      return null;
    }

    // Update access statistics
    await (supabase
      .from(CACHE_TABLE) as any)
      .update({
        access_count: ((data as any).access_count || 0) + 1,
        last_accessed_at: new Date().toISOString(),
      })
      .eq("seed", seed);

    return (data as any).result as GeneratedVocab[];
  } catch (error) {
    console.error("Error getting cached vocab:", error);
    return null;
  }
}

/**
 * Set cached vocabulary
 */
export async function setCachedVocab(
  seed: string,
  result: GeneratedVocab[]
): Promise<boolean> {
  try {
    const supabase = await createClient();

    const { error } = await (supabase.from(CACHE_TABLE) as any).insert({
      seed,
      result,
      access_count: 1,
      created_at: new Date().toISOString(),
      last_accessed_at: new Date().toISOString(),
    });

    if (error) {
      // If duplicate key (already cached), ignore error
      if (error.code === "23505") {
        return true;
      }
      console.error("Error setting cached vocab:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error setting cached vocab:", error);
    return false;
  }
}

/**
 * Clear old cache entries (optional cleanup function)
 */
export async function clearOldCache(daysOld = 7): Promise<number> {
  try {
    const supabase = await createClient();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const { data, error } = await supabase
      .from(CACHE_TABLE)
      .delete()
      .lt("created_at", cutoffDate.toISOString())
      .select() as any;

    if (error) {
      console.error("Error clearing old cache:", error);
      return 0;
    }

    return data?.length || 0;
  } catch (error) {
    console.error("Error clearing old cache:", error);
    return 0;
  }
}

/**
 * Get cache statistics (optional)
 */
export async function getCacheStats(): Promise<{
  totalEntries: number;
  totalAccesses: number;
  oldestEntry: string | null;
  newestEntry: string | null;
}> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from(CACHE_TABLE)
      .select("created_at, access_count") as any;

    if (error || !data) {
      return {
        totalEntries: 0,
        totalAccesses: 0,
        oldestEntry: null,
        newestEntry: null,
      };
    }

    const totalAccesses = data.reduce(
      (sum: number, entry: any) => sum + (entry.access_count || 0),
      0
    );

    const sortedByDate = [...data].sort(
      (a: any, b: any) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    return {
      totalEntries: data.length,
      totalAccesses,
      oldestEntry: sortedByDate[0]?.created_at || null,
      newestEntry: sortedByDate[sortedByDate.length - 1]?.created_at || null,
    };
  } catch (error) {
    console.error("Error getting cache stats:", error);
    return {
      totalEntries: 0,
      totalAccesses: 0,
      oldestEntry: null,
      newestEntry: null,
    };
  }
}
