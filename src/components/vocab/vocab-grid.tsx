"use client";

/**
 * Vocabulary Grid Component
 *
 * Phase 03: Grid layout for vocabulary cards with selection functionality
 */

import { VocabCard } from "./vocab-card";
import type { GeneratedVocab } from "@/types/vocabulary";

export interface VocabGridProps {
  vocabList: GeneratedVocab[];
  selectedIds: Set<string>;
  onToggleSelect: (word: string) => void;
  onSelectAll?: () => void;
  onClearSelection?: () => void;
}

export function VocabGrid({
  vocabList,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onClearSelection,
}: VocabGridProps) {
  const selectedCount = selectedIds.size;
  const allSelected = vocabList.length > 0 && selectedCount === vocabList.length;

  const handleSelectAll = () => {
    if (allSelected && onClearSelection) {
      onClearSelection();
    } else if (onSelectAll) {
      onSelectAll();
    }
  };

  if (vocabList.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600 dark:text-gray-400">
          No vocabulary generated yet. Enter a topic or text to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-semibold text-2xl text-gray-900 dark:text-white">
            Generated {vocabList.length} Words
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Review and select the words you want to add to your collection
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSelectAll}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 font-medium border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
          >
            {allSelected ? "Deselect All" : "Select All"}
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {vocabList.map((vocab) => (
          <VocabCard
            key={vocab.word}
            vocab={vocab}
            isSelected={selectedIds.has(vocab.word)}
            onSelect={() => onToggleSelect(vocab.word)}
          />
        ))}
      </div>

      {/* Selection Summary */}
      {selectedCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 p-4 shadow-lg z-10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">
              <strong>{selectedCount} word{selectedCount !== 1 ? "s" : ""}</strong>{" "}
              selected
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Scroll up to review your selection
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
