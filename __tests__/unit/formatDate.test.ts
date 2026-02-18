import { describe, expect, it } from "vitest";
import { formatDate } from "@/lib/utils/formatDate";

describe("formatDate", () => {
  it("formats ISO dates into a readable string", () => {
    const result = formatDate("2026-02-17T00:00:00.000Z");
    expect(result).toMatch(/Feb/);
  });

  it("throws for invalid dates", () => {
    expect(() => formatDate("not-a-date")).toThrow("Invalid date format");
  });
});
