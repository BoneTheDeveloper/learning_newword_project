"use client";

/**
 * Saved Card Component
 *
 * Display a saved vocabulary card with definitions, examples, and collections
 */

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, ChevronDown, ChevronUp, FolderOpen } from "lucide-react";
import type { SavedCard } from "@/types/vocabulary";
import { cn } from "@/lib/utils";

export interface SavedCardProps {
  card: SavedCard;
  isSelected?: boolean;
  onSelect?: () => void;
  showSelect?: boolean;
  onDelete?: () => void;
  onViewCollections?: () => void;
}

export function SavedCard({
  card,
  isSelected = false,
  onSelect,
  showSelect = false,
  onDelete,
  onViewCollections,
}: SavedCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const difficultyColors = {
    beginner: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
    intermediate: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
    advanced: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
    easy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
    medium: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
    hard: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
  };

  const partOfSpeechColors = {
    noun: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
    verb: "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300",
    adjective: "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300",
    adverb: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300",
    other: "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-300",
  };

  const difficultyBadge = card.difficulty
    ? card.difficulty.toLowerCase()
    : "medium";

  const hasCollocations = card.collocations && (
    card.collocations.adjectiveNoun?.length > 0 ||
    card.collocations.verbNoun?.length > 0 ||
    card.collocations.nounPreposition?.length > 0 ||
    card.collocations.adverbAdjective?.length > 0
  );

  const hasSynonyms = card.synonyms && card.synonyms.length > 0;
  const hasExtraContent = hasCollocations || hasSynonyms;

  return (
    <Card
      className={cn(
        "group transition-all hover:shadow-lg",
        isSelected
          ? "border-2 border-indigo-500"
          : "border border-gray-200 hover:border-gray-300 dark:border-slate-700 dark:hover:border-slate-600"
      )}
    >
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {card.difficulty && (
              <Badge
                className={difficultyColors[difficultyBadge as keyof typeof difficultyColors] || difficultyColors.medium}
              >
                {card.difficulty}
              </Badge>
            )}
            {card.part_of_speech && (
              <Badge
                className={partOfSpeechColors[card.part_of_speech.toLowerCase() as keyof typeof partOfSpeechColors] || partOfSpeechColors.other}
                variant="outline"
              >
                {card.part_of_speech}
              </Badge>
            )}
            {card.collections && card.collections.length > 0 && (
              <Badge variant="outline" className="flex items-center gap-1">
                <FolderOpen className="w-3 h-3" />
                {card.collections.length}
              </Badge>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {showSelect && onSelect && (
              <button
                onClick={onSelect}
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center transition-colors",
                  isSelected
                    ? "bg-indigo-600"
                    : "border-2 border-gray-300 dark:border-slate-600 hover:border-indigo-400"
                )}
              >
                {isSelected && (
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Word and Phonetic */}
        <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white mb-1">
          {card.word}
        </h3>
        {card.phonetic && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {card.phonetic}
          </p>
        )}

        {/* Primary Definition */}
        {card.definitions.length > 0 && (
          <div className="mb-3">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {card.definitions[0].text}
            </p>
          </div>
        )}

        {/* Example */}
        {card.definitions.length > 0 &&
          card.definitions[0].examples.length > 0 && (
            <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-3 text-sm mb-3">
              <span className="text-gray-500 dark:text-gray-400 text-xs">
                Example:{" "}
              </span>
              <span className="text-gray-700 dark:text-gray-300">
                &ldquo;{card.definitions[0].examples[0]}&rdquo;
              </span>
            </div>
          )}

        {/* Collections */}
        {card.collections && card.collections.length > 0 && onViewCollections && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewCollections();
            }}
            className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 mb-2 flex items-center gap-1"
          >
            <FolderOpen className="w-3 h-3" />
            View in {card.collections.length} collection
            {card.collections.length > 1 ? "s" : ""}
          </button>
        )}

        {/* Expand Button */}
        {hasExtraContent && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4 mr-1" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-1" />
                Show Collocations & Synonyms
              </>
            )}
          </Button>
        )}

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-4 space-y-4">
            {/* Collocations */}
            {hasCollocations && card.collocations && (
              <div>
                <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                  Collocations
                </h4>
                <div className="space-y-2 text-sm">
                  {card.collocations.adjectiveNoun?.length > 0 && (
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">
                        Adj + Noun:{" "}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {card.collocations.adjectiveNoun.join(", ")}
                      </span>
                    </div>
                  )}
                  {card.collocations.verbNoun?.length > 0 && (
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">
                        Verb + Noun:{" "}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {card.collocations.verbNoun.join(", ")}
                      </span>
                    </div>
                  )}
                  {card.collocations.nounPreposition?.length > 0 && (
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">
                        Noun + Prep:{" "}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {card.collocations.nounPreposition.join(", ")}
                      </span>
                    </div>
                  )}
                  {card.collocations.adverbAdjective?.length > 0 && (
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">
                        Adv + Adj:{" "}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {card.collocations.adverbAdjective.join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Synonyms */}
            {hasSynonyms && card.synonyms && (
              <div>
                <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                  Synonyms
                </h4>
                <div className="flex flex-wrap gap-2">
                  {card.synonyms.map((synonym, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs"
                    >
                      {synonym.word}
                      <span className="ml-1 opacity-60">
                        ({synonym.formality})
                      </span>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
