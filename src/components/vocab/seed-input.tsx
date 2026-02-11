"use client";

/**
 * Seed Input Component
 *
 * Phase 03: Input component for vocabulary generation seed
 * Supports topic, text paste, or learning goal description
 */

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Sparkles } from "lucide-react";

export interface SeedInputProps {
  onSubmit: (seed: string, count: number, difficulty: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function SeedInput({
  onSubmit,
  isLoading = false,
  placeholder = "Enter a topic (e.g., 'business English'), paste an article, or describe your learning goal...",
}: SeedInputProps) {
  const [seed, setSeed] = useState("");
  const [count, setCount] = useState("10");
  const [difficulty, setDifficulty] = useState("intermediate");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (seed.trim()) {
      onSubmit(seed.trim(), parseInt(count), difficulty);
    }
  };

  const isDisabled = isLoading || !seed.trim();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Seed Input */}
      <div className="space-y-2">
        <Label htmlFor="seed-input">
          What do you want to learn today?
        </Label>
        <Textarea
          id="seed-input"
          value={seed}
          onChange={(e) => setSeed(e.target.value)}
          placeholder={placeholder}
          className="min-h-[120px] border-2 border-dashed resize-none"
          disabled={isLoading}
        />
      </div>

      {/* Options Row */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Difficulty Select */}
        <div className="flex items-center gap-2">
          <Label htmlFor="difficulty-select" className="text-sm text-gray-600">
            Difficulty:
          </Label>
          <Select
            value={difficulty}
            onValueChange={setDifficulty}
            disabled={isLoading}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Count Select */}
        <div className="flex items-center gap-2">
          <Label htmlFor="count-select" className="text-sm text-gray-600">
            Words:
          </Label>
          <Select
            value={count}
            onValueChange={setCount}
            disabled={isLoading}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="15">15</SelectItem>
              <SelectItem value="20">20</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          disabled={isDisabled}
          className="ml-auto"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
