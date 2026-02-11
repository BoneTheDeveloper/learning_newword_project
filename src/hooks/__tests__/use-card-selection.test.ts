/**
 * Card Selection Hook Tests
 *
 * Tests for the card selection state management
 */

import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCardSelection } from "../use-card-selection";

describe("useCardSelection", () => {
  it("should initialize with empty selection", () => {
    const { result } = renderHook(() => useCardSelection());

    expect(result.current.selectedCount).toBe(0);
    expect(result.current.isAllSelected).toBe(false);
    expect(result.current.getSelectedIds()).toEqual([]);
  });

  it("should toggle card selection", () => {
    const { result } = renderHook(() => useCardSelection());

    act(() => {
      result.current.toggleSelection("card-1");
    });

    expect(result.current.selectedIds.has("card-1")).toBe(true);
    expect(result.current.selectedCount).toBe(1);
    expect(result.current.isSelected("card-1")).toBe(true);
  });

  it("should toggle card off when already selected", () => {
    const { result } = renderHook(() => useCardSelection());

    act(() => {
      result.current.toggleSelection("card-1");
      result.current.toggleSelection("card-1");
    });

    expect(result.current.selectedIds.has("card-1")).toBe(false);
    expect(result.current.selectedCount).toBe(0);
  });

  it("should select all cards", () => {
    const { result } = renderHook(() => useCardSelection(3));
    const allIds = ["card-1", "card-2", "card-3"];

    act(() => {
      result.current.selectAll(allIds);
    });

    expect(result.current.selectedCount).toBe(3);
    expect(result.current.isAllSelected).toBe(true);
    allIds.forEach((id) => {
      expect(result.current.isSelected(id)).toBe(true);
    });
  });

  it("should clear selection", () => {
    const { result } = renderHook(() => useCardSelection());

    act(() => {
      result.current.toggleSelection("card-1");
      result.current.toggleSelection("card-2");
      result.current.clearSelection();
    });

    expect(result.current.selectedCount).toBe(0);
    expect(result.current.getSelectedIds()).toEqual([]);
  });

  it("should select range of cards", () => {
    const { result } = renderHook(() => useCardSelection());
    const allIds = ["card-1", "card-2", "card-3", "card-4", "card-5"];

    act(() => {
      result.current.selectRange("card-1", "card-3", allIds);
    });

    // Should select cards 1, 2, 3
    expect(result.current.isSelected("card-1")).toBe(true);
    expect(result.current.isSelected("card-2")).toBe(true);
    expect(result.current.isSelected("card-3")).toBe(true);
    expect(result.current.isSelected("card-4")).toBe(false);
    expect(result.current.isSelected("card-5")).toBe(false);
  });

  it("should select range in reverse order", () => {
    const { result } = renderHook(() => useCardSelection());
    const allIds = ["card-1", "card-2", "card-3", "card-4", "card-5"];

    act(() => {
      result.current.selectRange("card-4", "card-2", allIds);
    });

    // Should select cards 2, 3, 4
    expect(result.current.isSelected("card-1")).toBe(false);
    expect(result.current.isSelected("card-2")).toBe(true);
    expect(result.current.isSelected("card-3")).toBe(true);
    expect(result.current.isSelected("card-4")).toBe(true);
    expect(result.current.isSelected("card-5")).toBe(false);
  });

  it("should track last selected ID", () => {
    const { result } = renderHook(() => useCardSelection());

    act(() => {
      result.current.toggleSelection("card-1");
      result.current.toggleSelection("card-2");
    });

    expect(result.current.selectedIds.has("card-2")).toBe(true);
  });

  it("should correctly identify when all items are selected", () => {
    const { result } = renderHook(() => useCardSelection(3));
    const allIds = ["card-1", "card-2", "card-3"];

    act(() => {
      result.current.selectAll(allIds);
    });

    expect(result.current.isAllSelected).toBe(true);
  });

  it("should return selected IDs as array", () => {
    const { result } = renderHook(() => useCardSelection());

    act(() => {
      result.current.toggleSelection("card-1");
      result.current.toggleSelection("card-2");
      result.current.toggleSelection("card-3");
    });

    const selectedIds = result.current.getSelectedIds();
    expect(selectedIds).toHaveLength(3);
    expect(selectedIds).toContain("card-1");
    expect(selectedIds).toContain("card-2");
    expect(selectedIds).toContain("card-3");
  });
});
