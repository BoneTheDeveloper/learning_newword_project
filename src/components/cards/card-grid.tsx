"use client";

/**
 * Card Grid Component
 *
 * Grid layout for saved cards with selection and view mode options
 */

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Grid3x3, List, Search } from "lucide-react";
import { SavedCard } from "./saved-card";
import type { SavedCard as SavedCardType, CardViewMode } from "@/types/vocabulary";
import { cn } from "@/lib/utils";

export interface CardGridProps {
  cards: SavedCardType[];
  selectedIds: Set<string>;
  viewMode: CardViewMode;
  onSelectCard?: (cardId: string) => void;
  onDeleteCard?: (cardId: string) => void;
  onDeleteSelected?: () => void;
  onViewCollections?: (cardId: string) => void;
  onChangeViewMode?: (mode: CardViewMode) => void;
  showSearch?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  showFilters?: boolean;
  showSelect?: boolean;
}

export function CardGrid({
  cards,
  selectedIds,
  viewMode,
  onSelectCard,
  onDeleteCard,
  onDeleteSelected,
  onViewCollections,
  onChangeViewMode,
  showSearch = true,
  searchQuery = "",
  onSearchChange,
  showFilters: _showFilters = true,
  showSelect = true,
}: CardGridProps) {
  const selectedCount = selectedIds.size;

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        {showSearch && (
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search cards..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-900"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          {onChangeViewMode && (
            <div className="flex items-center border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden">
              <button
                onClick={() => onChangeViewMode("grid")}
                className={cn(
                  "p-2 transition-colors",
                  viewMode === "grid"
                    ? "bg-indigo-600 text-white"
                    : "bg-white dark:bg-slate-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800"
                )}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => onChangeViewMode("list")}
                className={cn(
                  "p-2 transition-colors",
                  viewMode === "list"
                    ? "bg-indigo-600 text-white"
                    : "bg-white dark:bg-slate-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800"
                )}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Delete Selected */}
          {selectedCount > 0 && onDeleteSelected && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDeleteSelected}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
              Delete {selectedCount}
            </Button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {cards.length} {cards.length === 1 ? "card" : "cards"}
        {selectedCount > 0 && (
          <span className="ml-2 text-indigo-600 dark:text-indigo-400">
            ({selectedCount} selected)
          </span>
        )}
      </div>

      {/* Cards Grid/List */}
      {cards.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-display font-semibold text-xl text-gray-900 dark:text-white mb-2">
              No cards found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery
                ? "Try a different search term"
                : "Generate some vocabulary to get started"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div
          className={cn(
            viewMode === "grid"
              ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          )}
        >
          {cards.map((card) => (
            <SavedCard
              key={card.id}
              card={card}
              isSelected={selectedIds.has(card.id)}
              onSelect={
                showSelect && onSelectCard
                  ? () => onSelectCard(card.id)
                  : undefined
              }
              showSelect={showSelect}
              onDelete={
                onDeleteCard ? () => onDeleteCard(card.id) : undefined
              }
              onViewCollections={
                onViewCollections ? () => onViewCollections(card.id) : undefined
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
