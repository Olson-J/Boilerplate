import { describe, expect, it, vi } from "vitest";
import type { User } from "@supabase/supabase-js";

const mockGetUser = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: () => ({
    auth: {
      getUser: mockGetUser,
    },
  }),
}));

describe("server auth utilities", () => {
  it("getUser returns a user when present", async () => {
    const user = { id: "user-1", email: "test@example.com" } as User;
    mockGetUser.mockResolvedValueOnce({ data: { user }, error: null });

    const { getUser } = await import("@/lib/auth/server");
    const result = await getUser();

    expect(result).toEqual(user);
  });

  it("getUser returns null when no user", async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null }, error: null });

    const { getUser } = await import("@/lib/auth/server");
    const result = await getUser();

    expect(result).toBeNull();
  });

  it("getUser throws when Supabase returns an error", async () => {
    mockGetUser.mockResolvedValueOnce({
      data: { user: null },
      error: new Error("Auth error"),
    });

    const { getUser } = await import("@/lib/auth/server");
    await expect(getUser()).rejects.toThrow("Auth error");
  });

  it("requireAuth throws when unauthenticated", async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null }, error: null });

    const { requireAuth } = await import("@/lib/auth/server");
    await expect(requireAuth()).rejects.toThrow("User not authenticated");
  });
});
