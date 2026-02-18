import { describe, expect, it } from "vitest";
import { ensureUser } from "@/lib/auth/ensureUser";

describe("ensureUser", () => {
  it("returns the user when present", () => {
    const user = { id: "user-1", email: "test@example.com" };
    expect(ensureUser(user)).toEqual(user);
  });

  it("throws when user is missing", () => {
    expect(() => ensureUser(null)).toThrow("User not authenticated");
  });
});
