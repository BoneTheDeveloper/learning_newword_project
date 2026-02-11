"use client";

/**
 * Collection Select Component
 *
 * Dropdown for selecting collections with option to create new
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, FolderPlus } from "lucide-react";
import type { Collection } from "@/types/database";

export interface CollectionSelectProps {
  collections: Collection[];
  value?: string;
  onChange: (value: string) => void;
  onCreateNew?: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export function CollectionSelect({
  collections,
  value,
  onChange,
  onCreateNew,
  placeholder = "Select a collection...",
  disabled = false,
}: CollectionSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Select
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {collections.map((collection) => (
            <SelectItem key={collection.id} value={collection.id}>
              <div className="flex items-center gap-2">
                {collection.color && (
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: collection.color }}
                  />
                )}
                <span>{collection.name}</span>
              </div>
            </SelectItem>
          ))}

          {collections.length === 0 && (
            <div className="px-2 py-4 text-center text-sm text-gray-500">
              No collections yet
            </div>
          )}

          {onCreateNew && (
            <div className="border-t border-gray-200 dark:border-slate-700 mt-1 pt-1">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsOpen(false);
                  onCreateNew();
                }}
                className="w-full flex items-center gap-2 px-2 py-2 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-md transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create new collection
              </button>
            </div>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}

/**
 * Collection Create Button
 */
export function CreateCollectionButton({
  onClick,
  variant = "outline",
  size = "default",
}: {
  onClick: () => void;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}) {
  return (
    <Button onClick={onClick} variant={variant} size={size}>
      <FolderPlus className="w-4 h-4 mr-2" />
      New Collection
    </Button>
  );
}
