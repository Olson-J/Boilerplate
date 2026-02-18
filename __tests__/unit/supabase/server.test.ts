import { describe, expect, it, vi } from "vitest";

vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(() => ({ auth: { getUser: vi.fn() } })),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({
    getAll: vi.fn(() => []),
    set: vi.fn(),
  })),
}));

describe("createSupabaseServerClient", () => {
  it("creates a server client with env credentials", async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "http://localhost:54321";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon";

    const { createSupabaseServerClient } = await import(
      "@/lib/supabase/server"
    );
    const { createServerClient } = await import("@supabase/ssr");

    createSupabaseServerClient();

    expect(createServerClient).toHaveBeenCalledWith(
      "http://localhost:54321",
      "test-anon",
      expect.objectContaining({
        cookies: expect.any(Object),
      })
    );
  });
});
