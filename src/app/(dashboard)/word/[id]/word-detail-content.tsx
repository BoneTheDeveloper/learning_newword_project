"use client";

/**
 * Word Detail Client Component
 *
 * Client-side word detail page with all V2.0 UI components integrated
 */

import { useState, useCallback, useEffect } from "react";
import { ArrowLeft, Bookmark, BookmarkCheck, Share2, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WordRating } from "@/components/vocab/word-rating";
import { AudioPlayer } from "@/components/tts/audio-player";
import { ExampleDisplay } from "@/components/context/example-display";
import { cn } from "@/lib/utils";
import type { WordBankWithTopics } from "@/lib/db/word-bank";
import type { ContextExample } from "@/components/context/example-display";

export interface WordDetailContentProps {
  word: WordBankWithTopics;
  userId: string;
}

// ============================================================================
// Synonyms Section Component
// ============================================================================

interface SynonymsSectionProps {
  synonyms: string[] | null;
  onWordClick?: (word: string) => void;
}

function SynonymsSection({ synonyms, onWordClick }: SynonymsSectionProps) {
  if (!synonyms || synonyms.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
        Synonyms
      </h3>
      <div className="flex flex-wrap gap-2">
        {synonyms.map((synonym, index) => (
          <Badge
            key={index}
            variant="secondary"
            className={cn(
              "cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-500/20",
              "transition-colors px-3 py-1"
            )}
            onClick={() => onWordClick?.(synonym)}
          >
            {synonym}
          </Badge>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Main Word Detail Component
// ============================================================================

export function WordDetailContent({ word, userId: _userId }: WordDetailContentProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [examples, setExamples] = useState<ContextExample[]>([]);
  const [isLoadingExamples, setIsLoadingExamples] = useState(true);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [isAudioCached, setIsAudioCached] = useState(false);

  // Fetch examples on mount
  useEffect(() => {
    async function fetchExamples() {
      setIsLoadingExamples(true);
      try {
        const response = await fetch(`/api/examples?word_id=${word.id}&count=6`);
        if (!response.ok) throw new Error("Failed to fetch examples");

        const { data } = await response.json();
        setExamples(data || []);
      } catch (error) {
        console.error("Error fetching examples:", error);
      } finally {
        setIsLoadingExamples(false);
      }
    }

    fetchExamples();
  }, [word.id]);

  // Fetch audio status on mount
  useEffect(() => {
    async function fetchAudio() {
      try {
        const response = await fetch(`/api/tts?word_id=${word.id}`);
        if (!response.ok) throw new Error("Failed to fetch audio");

        const { data, meta } = await response.json();

        if (data && data.audioUrl) {
          setAudioUrl(data.audioUrl);
          setIsAudioCached(meta?.cached || false);
        }
      } catch (error) {
        console.error("Error fetching audio:", error);
      }
    }

    fetchAudio();
  }, [word.id]);

  // Handle word save
  const handleSave = useCallback(async () => {
    try {
      const response = await fetch("/api/user/word-bank", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word_id: word.id }),
      });

      if (response.ok) {
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Error saving word:", error);
    }
  }, [word.id]);

  // Handle word unsave
  const handleUnsave = useCallback(async () => {
    try {
      const response = await fetch(`/api/user/word-bank?word_id=${word.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setIsSaved(false);
      }
    } catch (error) {
      console.error("Error unsaving word:", error);
    }
  }, [word.id]);

  // Handle rating submission
  const handleRate = useCallback(async (rating: number) => {
    try {
      const response = await fetch("/api/words/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word_id: word.id, rating }),
      });

      if (response.ok) {
        setUserRating(rating);
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      throw error;
    }
  }, [word.id]);

  // Handle audio regeneration
  const handleRegenerateAudio = useCallback(async () => {
    setIsGeneratingAudio(true);
    try {
      const response = await fetch(`/api/tts?word_id=${word.id}`, {
        method: "GET",
      });

      if (!response.ok) throw new Error("Failed to regenerate audio");

      const { data } = await response.json();
      if (data?.audioUrl) {
        setAudioUrl(data.audioUrl);
        setIsAudioCached(false);
      }
    } catch (error) {
      console.error("Error regenerating audio:", error);
    } finally {
      setIsGeneratingAudio(false);
    }
  }, [word.id]);

  // Handle example regeneration
  const handleRegenerateExamples = useCallback(async () => {
    setIsLoadingExamples(true);
    try {
      const response = await fetch(`/api/examples?word_id=${word.id}&generate=true`, {
        method: "GET",
      });

      if (!response.ok) throw new Error("Failed to regenerate examples");

      const { data } = await response.json();
      setExamples(data || []);
    } catch (error) {
      console.error("Error regenerating examples:", error);
    } finally {
      setIsLoadingExamples(false);
    }
  }, [word.id]);

  // Handle copy example
  const handleCopyExample = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
  }, []);

  // Handle example rating
  const handleRateExample = useCallback(async (exampleId: string, rating: number) => {
    // Example rating endpoint - extend if needed
    console.log("Rating example:", exampleId, rating);
  }, []);

  // Handle share
  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: word.word,
        text: `${word.word}: ${word.definition}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  }, [word]);

  // Difficulty badge color
  const difficultyColors = {
    beginner: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
    intermediate: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
    advanced: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <a
              href="/dashboard"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Dashboard</span>
            </a>

            <div className="flex-1" />

            <Button
              variant={isSaved ? "default" : "outline"}
              onClick={isSaved ? handleUnsave : handleSave}
              className="flex items-center gap-2"
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="w-4 h-4" />
                  Saved
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  Save to Word Bank
                </>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              aria-label="Share word"
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Word Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Word Header Card */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {word.word}
                  </h1>

                  {/* Phonetic & IPA */}
                  {(word.pronunciation || word.ipa) && (
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      {word.pronunciation && (
                        <span>/{word.pronunciation}/</span>
                      )}
                      {word.ipa && (
                        <span className="font-mono">[{word.ipa}]</span>
                      )}
                    </div>
                  )}

                  {/* Badges */}
                  <div className="flex items-center gap-2 mt-3">
                    {word.part_of_speech && word.part_of_speech.length > 0 && (
                      <Badge className="capitalize">
                        {word.part_of_speech[0]}
                      </Badge>
                    )}

                    {word.difficulty_level && (
                      <Badge className={difficultyColors[word.difficulty_level]}>
                        {word.difficulty_level}
                      </Badge>
                    )}

                    {word.language && (
                      <Badge variant="outline">
                        {word.language.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Community Stats */}
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span>{word.usage_count.toLocaleString()} views</span>
                <span>•</span>
                <span>Added {new Date(word.created_at).toLocaleDateString()}</span>
              </div>

              {/* Audio Player */}
              <div className="mb-6">
                <AudioPlayer
                  word={word.word}
                  audioUrl={audioUrl}
                  isGenerating={isGeneratingAudio}
                  isCached={isAudioCached}
                  onRegenerate={handleRegenerateAudio}
                  size="lg"
                />
              </div>

              {/* Rating */}
              <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
                <WordRating
                  wordId={word.id}
                  word={word.word}
                  userRating={userRating}
                  communityRating={word.rating_avg}
                  ratingCount={word.rating_count}
                  onRate={handleRate}
                  size="lg"
                />
              </div>
            </Card>

            {/* Definition Card */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Definition
              </h2>
              <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                {word.definition}
              </p>

              {/* Etymology */}
              {word.etymology && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Etymology
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {word.etymology}
                    {word.etymology_origin && (
                      <span className="ml-2 text-gray-500 dark:text-gray-500">
                        ({word.etymology_origin})
                      </span>
                    )}
                  </p>
                </div>
              )}
            </Card>

            {/* Mnemonics */}
            {word.mnemonics && word.mnemonics.length > 0 && (
              <Card className="p-6 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700">
                <h3 className="text-sm font-medium text-purple-800 dark:text-purple-200 mb-3">
                  Memory Aids (Mnemonics)
                </h3>
                <ul className="space-y-2">
                  {word.mnemonics.map((mnemonic, index) => (
                    <li
                      key={index}
                      className="text-sm text-purple-700 dark:text-purple-300 flex items-start gap-2"
                    >
                      <span className="text-purple-500 mt-0.5">•</span>
                      <span>{mnemonic}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Examples */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Contextual Examples
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRegenerateExamples}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
                >
                  {isLoadingExamples ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Regenerate"
                  )}
                </Button>
              </div>

              <ExampleDisplay
                examples={examples}
                loading={isLoadingExamples}
                onRate={handleRateExample}
                onCopy={handleCopyExample}
                onRegenerate={handleRegenerateExamples}
              />
            </Card>
          </div>

          {/* Right Column - Related */}
          <div className="space-y-6">
            {/* Topics */}
            {word.topics && word.topics.length > 0 && (
              <Card className="p-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Related Topics
                </h3>
                <div className="space-y-2">
                  {word.topics.slice(0, 5).map((topic, index) => (
                    <a
                      key={index}
                      href={`/dashboard/topics/${topic.topic_slug}`}
                      className="flex items-center gap-2 p-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <span className="font-medium">{topic.topic_slug}</span>
                      <span className="text-xs text-gray-500">
                        {topic.relevance_score}% relevant
                      </span>
                    </a>
                  ))}
                </div>
              </Card>
            )}

            {/* Synonyms */}
            <SynonymsSection synonyms={word.synonyms} />
          </div>
        </div>
      </main>
    </div>
  );
}
