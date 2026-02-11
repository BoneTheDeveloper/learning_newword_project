/**
 * Card Selection Hook
 *
 * Manages card selection state with support for:
 * - Single toggle selection
 * - Range selection (shift+click)
 * - Select all/clear
 */

import { useState, useCallback } from "react";

export interface SelectionState {
  selectedIds: Set<string>;
  lastSelectedId: string | null;
}

export interface UseCardSelectionReturn {
  selectedIds: Set<string>;
  selectedCount: number;
  isAllSelected: boolean;
  toggleSelection: (id: string, allIds?: string[]) => void;
  selectRange: (fromId: string, toId: string, allIds: string[]) => void;
  selectAll: (allIds: string[]) => void;
  clearSelection: () => void;
  isSelected: (id: string) => boolean;
  getSelectedIds: () => string[];
}

export function useCardSelection(
  totalItems?: number
): UseCardSelectionReturn {
  const [selection, setSelection] = useState<SelectionState>({
    selectedIds: new Set(),
    lastSelectedId: null,
  });

  const selectedCount = selection.selectedIds.size;
  const isAllSelected = totalItems !== undefined && selectedCount === totalItems;

  const toggleSelection = useCallback(
    (id: string, _allIds?: string[]) => {
      setSelection((prev) => {
        const newSelected = new Set(prev.selectedIds);

        if (newSelected.has(id)) {
          newSelected.delete(id);
        } else {
          newSelected.add(id);
        }

        return {
          selectedIds: newSelected,
          lastSelectedId: id,
        };
      });
    },
    []
  );

  const selectRange = useCallback((fromId: string, toId: string, allIds: string[]) => {
    setSelection((prev) => {
      const fromIndex = allIds.indexOf(fromId);
      const toIndex = allIds.indexOf(toId);

      if (fromIndex === -1 || toIndex === -1) {
        return prev;
      }

      const start = Math.min(fromIndex, toIndex);
      const end = Math.max(fromIndex, toIndex);

      const newSelected = new Set(prev.selectedIds);

      // Add all IDs in range
      for (let i = start; i <= end; i++) {
        newSelected.add(allIds[i]);
      }

      return {
        selectedIds: newSelected,
        lastSelectedId: toId,
      };
    });
  }, []);

  const selectAll = useCallback((allIds: string[]) => {
    setSelection({
      selectedIds: new Set(allIds),
      lastSelectedId: allIds.length > 0 ? allIds[allIds.length - 1] : null,
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelection({
      selectedIds: new Set(),
      lastSelectedId: null,
    });
  }, []);

  const isSelected = useCallback(
    (id: string) => selection.selectedIds.has(id),
    [selection.selectedIds]
  );

  const getSelectedIds = useCallback(() => {
    return Array.from(selection.selectedIds);
  }, [selection.selectedIds]);

  return {
    selectedIds: selection.selectedIds,
    selectedCount,
    isAllSelected,
    toggleSelection,
    selectRange,
    selectAll,
    clearSelection,
    isSelected,
    getSelectedIds,
  };
}
