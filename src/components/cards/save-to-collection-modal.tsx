"use client";

/**
 * Save to Collection Modal
 *
 * Modal for saving selected generated cards to a collection
 */

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CollectionSelect } from "./collection-select";
import { Check, AlertCircle, Loader2 } from "lucide-react";
import type { Collection } from "@/types/database";
import type { CreateCardData } from "@/lib/db/cards";

export interface SaveToCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collections: Collection[];
  selectedCards: CreateCardData[];
  onSave: (collectionId: string) => Promise<{ success: boolean; error?: string }>;
  onCreateCollection?: (name: string, description?: string) => Promise<Collection | null>;
}

export function SaveToCollectionModal({
  isOpen,
  onClose,
  collections,
  selectedCards,
  onSave,
  onCreateCollection,
}: SaveToCollectionModalProps) {
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [showNewCollection, setShowNewCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [newCollectionDescription, setNewCollectionDescription] = useState("");
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [result, setResult] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const cardCount = selectedCards.length;

  const handleSave = async () => {
    if (!selectedCollectionId) return;

    setIsSaving(true);
    setResult(null);

    try {
      const response = await onSave(selectedCollectionId);

      if (response.success) {
        setResult({
          type: "success",
          message: `Successfully saved ${cardCount} ${cardCount === 1 ? "card" : "cards"} to collection!`,
        });

        // Close modal after success
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setResult({
          type: "error",
          message: response.error || "Failed to save cards. Please try again.",
        });
      }
    } catch (error) {
      setResult({
        type: "error",
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) return;

    setIsCreatingCollection(true);
    setResult(null);

    try {
      if (!onCreateCollection) {
        setResult({
          type: "error",
          message: "Collection creation not available.",
        });
        return;
      }

      const newCollection = await onCreateCollection(
        newCollectionName.trim(),
        newCollectionDescription.trim() || undefined
      );

      if (newCollection) {
        setSelectedCollectionId(newCollection.id);
        setShowNewCollection(false);
        setNewCollectionName("");
        setNewCollectionDescription("");
      } else {
        setResult({
          type: "error",
          message: "Failed to create collection. Please try again.",
        });
      }
    } catch (error) {
      setResult({
        type: "error",
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsCreatingCollection(false);
    }
  };

  const handleClose = () => {
    if (!isSaving && !isCreatingCollection) {
      setSelectedCollectionId("");
      setShowNewCollection(false);
      setNewCollectionName("");
      setNewCollectionDescription("");
      setResult(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Save to Collection</DialogTitle>
          <DialogDescription>
            Save {cardCount} {cardCount === 1 ? "card" : "cards"} to a collection
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Result Message */}
          {result && (
            <div
              className={`flex items-start gap-3 p-4 rounded-lg ${
                result.type === "success"
                  ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300"
                  : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300"
              }`}
            >
              {result.type === "success" ? (
                <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              )}
              <p className="text-sm">{result.message}</p>
            </div>
          )}

          {!result && !showNewCollection && (
            <div className="space-y-2">
              <Label htmlFor="collection">Select Collection</Label>
              <CollectionSelect
                collections={collections}
                value={selectedCollectionId}
                onChange={setSelectedCollectionId}
                onCreateNew={() => setShowNewCollection(true)}
                placeholder="Choose a collection..."
              />
            </div>
          )}

          {showNewCollection && !result && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-collection-name">Collection Name</Label>
                <Input
                  id="new-collection-name"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  placeholder="e.g., Business English"
                  disabled={isCreatingCollection}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-collection-description">
                  Description (optional)
                </Label>
                <Textarea
                  id="new-collection-description"
                  value={newCollectionDescription}
                  onChange={(e) => setNewCollectionDescription(e.target.value)}
                  placeholder="What kind of vocabulary will this collection contain?"
                  rows={3}
                  disabled={isCreatingCollection}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowNewCollection(false);
                    setNewCollectionName("");
                    setNewCollectionDescription("");
                  }}
                  disabled={isCreatingCollection}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateCollection}
                  disabled={!newCollectionName.trim() || isCreatingCollection}
                  className="flex-1"
                >
                  {isCreatingCollection && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Create
                </Button>
              </div>
            </div>
          )}
        </div>

        {!result && !showNewCollection && (
          <DialogFooter>
            <Button variant="outline" onClick={handleClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!selectedCollectionId || isSaving}
            >
              {isSaving && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Save {cardCount} {cardCount === 1 ? "Card" : "Cards"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
