"use client";

/**
 * Collections Page
 *
 * Phase 04: Browse and manage vocabulary collections
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCollectionsWithStats, deleteCollection } from "@/lib/db/collections";
import type { CollectionWithStats } from "@/types/vocabulary";
import {
  FolderOpen,
  Plus,
  Trash2,
  BookOpen,
} from "lucide-react";

export default function CollectionsPage() {
  const router = useRouter();
  const [collections, setCollections] = useState<CollectionWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    setIsLoading(true);
    try {
      const data = await getCollectionsWithStats();
      setCollections(data);
    } catch (err) {
      console.error("Error loading collections:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCollection = async (id: string, name: string) => {
    if (!confirm(`Delete collection "${name}"? This will not delete the cards.`)) {
      return;
    }

    try {
      await deleteCollection(id);
      await loadCollections();
    } catch (err) {
      console.error("Error deleting collection:", err);
    }
  };

  const handleViewCollection = (id: string) => {
    router.push(`/collections/${id}`);
  };

  const handleStartReview = (id: string) => {
    router.push(`/review?collection=${id}`);
  };

  // Calculate stats
  const totalCards = collections.reduce((sum, c) => sum + c.card_count, 0);
  const totalCollections = collections.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12">
        <div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 dark:text-white mb-2">
            My Collections
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Organize and manage your vocabulary collections
          </p>
        </div>
        <Button
          onClick={() => router.push("/generate")}
          className="mt-4 sm:mt-0"
        >
          <Plus className="w-5 h-5 mr-2" />
          Generate Cards
        </Button>
      </div>

      {/* Stats Section */}
      <Card className="mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 border-0">
        <CardContent className="p-8">
          <div className="grid sm:grid-cols-3 gap-8 text-white">
            <div className="text-center">
              <div className="font-display font-bold text-4xl mb-2">
                {totalCards}
              </div>
              <div className="text-white/80">Total Cards</div>
            </div>
            <div className="text-center">
              <div className="font-display font-bold text-4xl mb-2">
                {totalCollections}
              </div>
              <div className="text-white/80">Active Collections</div>
            </div>
            <div className="text-center">
              <div className="font-display font-bold text-4xl mb-2">
                {collections.filter((c) => c.card_count > 0).length}
              </div>
              <div className="text-white/80">Collections with Cards</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading collections...</p>
        </div>
      ) : collections.length === 0 ? (
        /* Empty State */
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
              <FolderOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-display font-semibold text-xl text-gray-900 dark:text-white mb-2">
              No collections yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Generate some vocabulary cards and save them to a collection to get started.
            </p>
            <Button onClick={() => router.push("/generate")}>
              <Plus className="w-5 h-5 mr-2" />
              Generate Vocabulary
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Collections Grid */
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {collections.map((collection) => (
            <Card
              key={collection.id}
              className="group hover:shadow-lg transition-all cursor-pointer"
            >
              <CardContent className="p-6">
                {/* Icon and Actions */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{
                      background: collection.color
                        ? collection.color
                        : "linear-gradient(135deg, #4F46E5 0%, #A855F7 100%)",
                    }}
                  >
                    <FolderOpen className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCollection(collection.id, collection.name);
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Name and Description */}
                <h3
                  onClick={() => handleViewCollection(collection.id)}
                  className="font-display font-semibold text-xl text-gray-900 dark:text-white mb-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {collection.name}
                </h3>
                {collection.description && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {collection.description}
                  </p>
                )}

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {collection.card_count} {collection.card_count === 1 ? "card" : "cards"}
                  </span>
                </div>

                {/* Progress Bar (placeholder for now) */}
                <div className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                    style={{ width: "0%" }}
                  />
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewCollection(collection.id)}
                    className="w-full"
                  >
                    View Cards
                  </Button>
                  {collection.card_count > 0 && (
                    <Button
                      size="sm"
                      onClick={() => handleStartReview(collection.id)}
                      className="w-full bg-indigo-600 hover:bg-indigo-700"
                    >
                      Start Reviewing
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add New Collection Card */}
          <Card
            onClick={() => router.push("/generate")}
            className="bg-gray-50 dark:bg-slate-800/50 border-2 border-dashed border-gray-300 dark:border-slate-600 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all cursor-pointer group flex items-center justify-center min-h-[280px]"
          >
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-slate-700 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900 flex items-center justify-center mx-auto mb-4 transition-colors">
                <Plus className="w-8 h-8 text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
              </div>
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
                Generate Cards
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Create new vocabulary
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
