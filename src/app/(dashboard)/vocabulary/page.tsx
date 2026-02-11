"use client";

/**
 * Vocabulary Page
 *
 * Phase 04: Browse and manage all saved vocabulary cards
 */

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CardGrid } from "@/components/cards/card-grid";
import { CollectionSelect } from "@/components/cards/collection-select";
import { getCards, deleteCards } from "@/lib/db/cards";
import { getCollections } from "@/lib/db/collections";
import { useCardSelection } from "@/hooks/use-card-selection";
import type { SavedCard as SavedCardType, CardViewMode, CardFilters } from "@/types/vocabulary";
import { Download } from "lucide-react";

export default function VocabularyPage() {
  const [cards, setCards] = useState<SavedCardType[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<CardViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
  const [selectedPartOfSpeech, setSelectedPartOfSpeech] = useState<string>("");

  const selection = useCardSelection(cards.length);

  // Load cards and collections
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const filters: CardFilters = {
        search: searchQuery || undefined,
        collection_id: selectedCollectionId || undefined,
        difficulty: selectedDifficulty || undefined,
        part_of_speech: selectedPartOfSpeech || undefined,
      };

      const [cardsData, collectionsData] = await Promise.all([
        getCards(filters),
        getCollections(),
      ]);

      setCards(cardsData);
      setCollections(collectionsData);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedCollectionId, selectedDifficulty, selectedPartOfSpeech]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDeleteSelected = async () => {
    const selectedIds = selection.getSelectedIds();
    if (selectedIds.length === 0) return;

    if (!confirm(`Delete ${selectedIds.length} card${selectedIds.length > 1 ? "s" : ""}?`)) {
      return;
    }

    try {
      await deleteCards(selectedIds);
      selection.clearSelection();
      await loadData();
    } catch (err) {
      console.error("Error deleting cards:", err);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    if (!confirm("Delete this card?")) return;

    try {
      await deleteCards([cardId]);
      await loadData();
    } catch (err) {
      console.error("Error deleting card:", err);
    }
  };

  const handleExportSelected = () => {
    const selectedIds = selection.getSelectedIds();
    const selectedCards = cards.filter((c) => selectedIds.includes(c.id));

    const exportData = selectedCards.map((card) => ({
      word: card.word,
      part_of_speech: card.part_of_speech,
      definitions: card.definitions,
      difficulty: card.difficulty,
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vocab-export-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 dark:text-white mb-4">
          My Vocabulary
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Browse and manage your saved vocabulary cards
        </p>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Collection Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Collection
            </label>
            <CollectionSelect
              collections={collections}
              value={selectedCollectionId}
              onChange={setSelectedCollectionId}
              placeholder="All collections"
            />
          </div>

          {/* Difficulty Filter */}
          <div className="lg:w-48">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Difficulty
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-900"
            >
              <option value="">All difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {/* Part of Speech Filter */}
          <div className="lg:w-48">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Part of Speech
            </label>
            <select
              value={selectedPartOfSpeech}
              onChange={(e) => setSelectedPartOfSpeech(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-900"
            >
              <option value="">All types</option>
              <option value="noun">Nouns</option>
              <option value="verb">Verbs</option>
              <option value="adjective">Adjectives</option>
              <option value="adverb">Adverbs</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCollectionId("");
                setSelectedDifficulty("");
                setSelectedPartOfSpeech("");
                setSearchQuery("");
              }}
              className="w-full lg:w-auto"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Loading State */}
      {isLoading ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading cards...</p>
        </div>
      ) : (
        <CardGrid
          cards={cards}
          selectedIds={selection.selectedIds}
          viewMode={viewMode}
          onSelectCard={(id) => selection.toggleSelection(id, cards.map((c) => c.id))}
          onDeleteCard={handleDeleteCard}
          onDeleteSelected={handleDeleteSelected}
          onChangeViewMode={setViewMode}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          showSelect={true}
        />
      )}

      {/* Export Selected Button */}
      {selection.selectedCount > 0 && (
        <div className="fixed bottom-20 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 p-4 shadow-lg z-10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">
              <strong>{selection.selectedCount} card{selection.selectedCount !== 1 ? "s" : ""}</strong> selected
            </span>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleExportSelected}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
