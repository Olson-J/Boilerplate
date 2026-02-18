import { describe, expect, it, vi } from "vitest";

vi.mock("@supabase/ssr", () => ({
  createBrowserClient: vi.fn(() => ({ auth: { getUser: vi.fn() } })),
}));

describe("createSupabaseClient", () => {
  it("creates a browser client with env credentials", async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "http://localhost:54321";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon";

    const { createSupabaseClient } = await import("@/lib/supabase/client");
    const { createBrowserClient } = await import("@supabase/ssr");

    createSupabaseClient();

    expect(createBrowserClient).toHaveBeenCalledWith(
      "http://localhost:54321",
      "test-anon"
    );
  });
});
