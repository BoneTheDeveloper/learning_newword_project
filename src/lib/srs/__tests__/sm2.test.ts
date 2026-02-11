/**
 * SM-2 Algorithm Tests
 *
 * Tests for the SuperMemo 2 spaced repetition algorithm
 */

import { describe, it, expect } from "vitest";
import {
  calculateNextReview,
  initializeCard,
  isCardDue,
  getDaysUntilReview,
  responseButtonToQuality,
  type Sm2Card,
} from "../sm2";

describe("SM-2 Algorithm", () => {
  describe("calculateNextReview", () => {
    it("should reset repetitions and interval when quality < 3", () => {
      const card: Sm2Card = {
        id: "1",
        easeFactor: 2.5,
        interval: 10,
        repetitions: 5,
        nextReviewDate: new Date(),
      };

      const result = calculateNextReview(card, 2); // quality < 3

      expect(result.repetitions).toBe(0);
      expect(result.interval).toBe(1);
    });

    it("should increase repetitions when quality >= 3", () => {
      const card: Sm2Card = {
        id: "1",
        easeFactor: 2.5,
        interval: 1,
        repetitions: 1,
        nextReviewDate: new Date(),
      };

      const result = calculateNextReview(card, 4); // quality >= 3

      expect(result.repetitions).toBe(2);
    });

    it("should set interval to 1 day for first repetition", () => {
      const card: Sm2Card = {
        id: "1",
        easeFactor: 2.5,
        interval: 0,
        repetitions: 0,
        nextReviewDate: new Date(),
      };

      const result = calculateNextReview(card, 4);

      expect(result.interval).toBe(1);
    });

    it("should set interval to 6 days for second repetition", () => {
      const card: Sm2Card = {
        id: "1",
        easeFactor: 2.5,
        interval: 1,
        repetitions: 1,
        nextReviewDate: new Date(),
      };

      const result = calculateNextReview(card, 4);

      expect(result.interval).toBe(6);
    });

    it("should calculate interval using ease factor for 3rd+ repetition", () => {
      const card: Sm2Card = {
        id: "1",
        easeFactor: 2.5,
        interval: 6,
        repetitions: 2,
        nextReviewDate: new Date(),
      };

      const result = calculateNextReview(card, 4);

      expect(result.interval).toBe(15); // 6 * 2.5 = 15
    });

    it("should decrease ease factor for low quality response", () => {
      const card: Sm2Card = {
        id: "1",
        easeFactor: 2.5,
        interval: 10,
        repetitions: 5,
        nextReviewDate: new Date(),
      };

      const result = calculateNextReview(card, 0); // worst quality

      expect(result.easeFactor).toBeLessThan(2.5);
    });

    it("should increase ease factor for high quality response", () => {
      const card: Sm2Card = {
        id: "1",
        easeFactor: 2.5,
        interval: 10,
        repetitions: 5,
        nextReviewDate: new Date(),
      };

      const result = calculateNextReview(card, 5); // best quality

      expect(result.easeFactor).toBeGreaterThan(2.5);
    });

    it("should not let ease factor go below minimum", () => {
      const card: Sm2Card = {
        id: "1",
        easeFactor: 1.3, // minimum
        interval: 10,
        repetitions: 5,
        nextReviewDate: new Date(),
      };

      const result = calculateNextReview(card, 0);

      expect(result.easeFactor).toBeGreaterThanOrEqual(1.3);
    });
  });

  describe("initializeCard", () => {
    it("should create a card with default values", () => {
      const card = initializeCard("test-id");

      expect(card.id).toBe("test-id");
      expect(card.easeFactor).toBe(2.5);
      expect(card.interval).toBe(0);
      expect(card.repetitions).toBe(0);
      expect(card.nextReviewDate).toBeInstanceOf(Date);
    });
  });

  describe("isCardDue", () => {
    it("should return true for cards due now", () => {
      const card: Sm2Card = {
        id: "1",
        easeFactor: 2.5,
        interval: 1,
        repetitions: 1,
        nextReviewDate: new Date(), // due now
      };

      expect(isCardDue(card)).toBe(true);
    });

    it("should return true for cards past due", () => {
      const pastDate = new Date();
      pastDate.setHours(pastDate.getHours() - 1);

      const card: Sm2Card = {
        id: "1",
        easeFactor: 2.5,
        interval: 1,
        repetitions: 1,
        nextReviewDate: pastDate,
      };

      expect(isCardDue(card)).toBe(true);
    });

    it("should return false for future cards", () => {
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 1);

      const card: Sm2Card = {
        id: "1",
        easeFactor: 2.5,
        interval: 1,
        repetitions: 1,
        nextReviewDate: futureDate,
      };

      expect(isCardDue(card)).toBe(false);
    });
  });

  describe("getDaysUntilReview", () => {
    it("should return 0 for due cards", () => {
      const card: Sm2Card = {
        id: "1",
        easeFactor: 2.5,
        interval: 1,
        repetitions: 1,
        nextReviewDate: new Date(),
      };

      expect(getDaysUntilReview(card)).toBe(0);
    });

    it("should return positive number for future cards", () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);

      const card: Sm2Card = {
        id: "1",
        easeFactor: 2.5,
        interval: 1,
        repetitions: 1,
        nextReviewDate: futureDate,
      };

      expect(getDaysUntilReview(card)).toBeGreaterThan(0);
      expect(getDaysUntilReview(card)).toBeLessThanOrEqual(5);
    });
  });

  describe("responseButtonToQuality", () => {
    it("should map 'again' to quality 0", () => {
      expect(responseButtonToQuality("again")).toBe(0);
    });

    it("should map 'hard' to quality 2", () => {
      expect(responseButtonToQuality("hard")).toBe(2);
    });

    it("should map 'good' to quality 4", () => {
      expect(responseButtonToQuality("good")).toBe(4);
    });

    it("should map 'easy' to quality 5", () => {
      expect(responseButtonToQuality("easy")).toBe(5);
    });
  });
});
