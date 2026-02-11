"use client";

/**
 * Generate Vocabulary Page
 *
 * Phase 04: Enhanced with save to collection functionality
 * Allows users to enter a topic/text and generate contextual vocabulary cards,
 * then save selected cards to collections
 */

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SeedInput } from "@/components/vocab/seed-input";
import { VocabGrid } from "@/components/vocab/vocab-grid";
import { LoadingState } from "@/components/vocab/loading-state";
import { SaveToCollectionModal } from "@/components/cards/save-to-collection-modal";
import { getCollections } from "@/lib/db/collections";
import { saveGeneratedCardsToCollection } from "@/lib/db/selection";
import type { GeneratedVocab } from "@/types/vocabulary";
import type { CreateCardData } from "@/lib/db/cards";
import { Save } from "lucide-react";

export default function GeneratePage() {
  const [vocabList, setVocabList] = useState<GeneratedVocab[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [collections, setCollections] = useState<any[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [_isSaving, setIsSaving] = useState(false);

  // Load collections on mount
  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      const data = await getCollections();
      setCollections(data);
    } catch (err) {
      console.error("Error loading collections:", err);
    }
  };

  const handleGenerate = async (seed: string, count: number, difficulty: string) => {
    setIsLoading(true);
    setError(null);
    setVocabList([]);
    setSelectedIds(new Set());

    try {
      const response = await fetch("/api/vocab/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          seed,
          count,
          difficulty,
          language: "English",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate vocabulary");
      }

      const data = await response.json();
      setVocabList(data.data || []);

      // Auto-select all words by default
      if (data.data && data.data.length > 0) {
        setSelectedIds(new Set(data.data.map((v: GeneratedVocab) => v.word)));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error generating vocabulary:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSelect = (word: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(word)) {
      newSelected.delete(word);
    } else {
      newSelected.add(word);
    }
    setSelectedIds(newSelected);
  };

  const handleSelectAll = () => {
    setSelectedIds(new Set(vocabList.map((v) => v.word)));
  };

  const handleClearSelection = () => {
    setSelectedIds(new Set());
  };

  const handleSaveClick = () => {
    setShowSaveModal(true);
  };

  const handleSave = async (collectionId: string) => {
    setIsSaving(true);

    try {
      // Get selected cards
      const selectedCards = vocabList.filter((v) =>
        selectedIds.has(v.word)
      );

      // Convert to CreateCardData format
      const cardsToSave: CreateCardData[] = selectedCards.map((vocab) => ({
        word: vocab.word,
        part_of_speech: vocab.partOfSpeech,
        phonetic: vocab.phonetic,
        definitions: vocab.definitions,
        collocations: vocab.collocations,
        synonyms: vocab.synonyms,
        difficulty: vocab.difficulty,
        context: undefined,
      }));

      // Save to collection
      const result = await saveGeneratedCardsToCollection(
        cardsToSave,
        collectionId
      );

      if (result.success) {
        // Clear selection and reload collections
        setSelectedIds(new Set());
        await loadCollections();
        return { success: true };
      } else {
        return {
          success: false,
          error: result.errors.join(", "),
        };
      }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to save cards",
      };
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateCollection = async (name: string, description?: string) => {
    try {
      const response = await fetch("/api/collections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description }),
      });

      if (!response.ok) {
        throw new Error("Failed to create collection");
      }

      const data = await response.json();
      await loadCollections();
      return data.data;
    } catch (err) {
      console.error("Error creating collection:", err);
      return null;
    }
  };

  const selectedCount = selectedIds.size;
  const hasSelection = selectedCount > 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 dark:text-white mb-4">
          Generate Vocabulary
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Enter a topic, paste text, or describe what you want to learn. AI will
          generate contextual vocabulary cards for you.
        </p>
      </div>

      {/* Input Section */}
      <Card className="p-6 sm:p-8 mb-8">
        <SeedInput onSubmit={handleGenerate} isLoading={isLoading} />
      </Card>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-8">
          <p className="text-red-800 dark:text-red-300 text-center">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && <LoadingState />}

      {/* Results */}
      {!isLoading && vocabList.length > 0 && (
        <div className="space-y-6">
          <VocabGrid
            vocabList={vocabList}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onSelectAll={handleSelectAll}
            onClearSelection={handleClearSelection}
          />

          {/* Save Button - Fixed at bottom */}
          {hasSelection && (
            <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 p-4 shadow-lg z-10">
              <div className="max-w-4xl mx-auto flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">
                  <strong>{selectedCount} word{selectedCount !== 1 ? "s" : ""}</strong>{" "}
                  selected
                </span>
                <Button
                  onClick={handleSaveClick}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save to Collection
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Initial Empty State */}
      {!isLoading && vocabList.length === 0 && !error && (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-indigo-600 dark:text-indigo-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h3 className="font-display font-semibold text-xl text-gray-900 dark:text-white mb-2">
            Ready to Generate
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Enter a topic, paste some text, or describe your learning goal above to
            get started with AI-powered vocabulary generation.
          </p>
        </div>
      )}

      {/* Save to Collection Modal */}
      <SaveToCollectionModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        collections={collections}
        selectedCards={vocabList
          .filter((v) => selectedIds.has(v.word))
          .map((v) => ({
            word: v.word,
            part_of_speech: v.partOfSpeech,
            phonetic: v.phonetic,
            definitions: v.definitions,
            collocations: v.collocations,
            synonyms: v.synonyms,
            difficulty: v.difficulty,
          }))}
        onSave={handleSave}
        onCreateCollection={handleCreateCollection}
      />
    </div>
  );
}
