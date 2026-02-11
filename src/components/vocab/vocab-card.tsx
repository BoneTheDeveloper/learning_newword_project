"use client";

/**
 * Vocabulary Card Component
 *
 * Phase 03: Display generated vocabulary with definitions, examples, and collocations
 */

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import type { GeneratedVocab } from "@/types/vocabulary";
import { cn } from "@/lib/utils";

export interface VocabCardProps {
  vocab: GeneratedVocab;
  isSelected?: boolean;
  onSelect?: () => void;
  showSelect?: boolean;
}

export function VocabCard({
  vocab,
  isSelected = false,
  onSelect,
  showSelect = true,
}: VocabCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const difficultyColors = {
    beginner: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
    intermediate: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
    advanced: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
  };

  const partOfSpeechColors = {
    noun: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
    verb: "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300",
    adjective: "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300",
    adverb: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300",
    other: "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-300",
  };

  const hasCollocations =
    vocab.collocations.adjectiveNoun.length > 0 ||
    vocab.collocations.verbNoun.length > 0 ||
    vocab.collocations.nounPreposition.length > 0 ||
    vocab.collocations.adverbAdjective.length > 0;

  return (
    <Card
      className={cn(
        "group cursor-pointer transition-all hover:shadow-lg",
        isSelected
          ? "border-2 border-indigo-500"
          : "border border-gray-200 hover:border-gray-300 dark:border-slate-700 dark:hover:border-slate-600"
      )}
      onClick={() => showSelect && onSelect?.()}
    >
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge
              variant={vocab.difficulty as any}
              className={difficultyColors[vocab.difficulty]}
            >
              {vocab.difficulty}
            </Badge>
            <Badge
              className={partOfSpeechColors[vocab.partOfSpeech]}
              variant="outline"
            >
              {vocab.partOfSpeech}
            </Badge>
          </div>

          {/* Selection Indicator */}
          {showSelect && (
            <div
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center transition-colors",
                isSelected
                  ? "bg-indigo-600"
                  : "border-2 border-gray-300 dark:border-slate-600"
              )}
            >
              {isSelected && <Check className="w-4 h-4 text-white" />}
            </div>
          )}
        </div>

        {/* Word and Phonetic */}
        <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white mb-1">
          {vocab.word}
        </h3>
        {vocab.phonetic && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {vocab.phonetic}
          </p>
        )}

        {/* Primary Definition */}
        {vocab.definitions.length > 0 && (
          <div className="mb-3">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {vocab.definitions[0].text}
            </p>
          </div>
        )}

        {/* Example */}
        {vocab.definitions.length > 0 &&
          vocab.definitions[0].examples.length > 0 && (
            <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-3 text-sm mb-3">
              <span className="text-gray-500 dark:text-gray-400 text-xs">
                Example:{" "}
              </span>
              <span className="text-gray-700 dark:text-gray-300">
                &ldquo;{vocab.definitions[0].examples[0]}&rdquo;
              </span>
            </div>
          )}

        {/* Expand Button */}
        {(hasCollocations || vocab.synonyms.length > 0) && (
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
            {hasCollocations && (
              <div>
                <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                  Collocations
                </h4>
                <div className="space-y-2 text-sm">
                  {vocab.collocations.adjectiveNoun.length > 0 && (
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">
                        Adj + Noun:{" "}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {vocab.collocations.adjectiveNoun.join(", ")}
                      </span>
                    </div>
                  )}
                  {vocab.collocations.verbNoun.length > 0 && (
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">
                        Verb + Noun:{" "}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {vocab.collocations.verbNoun.join(", ")}
                      </span>
                    </div>
                  )}
                  {vocab.collocations.nounPreposition.length > 0 && (
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">
                        Noun + Prep:{" "}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {vocab.collocations.nounPreposition.join(", ")}
                      </span>
                    </div>
                  )}
                  {vocab.collocations.adverbAdjective.length > 0 && (
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">
                        Adv + Adj:{" "}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {vocab.collocations.adverbAdjective.join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Synonyms */}
            {vocab.synonyms.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                  Synonyms
                </h4>
                <div className="flex flex-wrap gap-2">
                  {vocab.synonyms.map((synonym, index) => (
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
