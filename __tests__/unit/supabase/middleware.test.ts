import { describe, expect, it, vi } from "vitest";

const mockGetUser = vi.fn(async () => ({ data: { user: null }, error: null }));

vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(() => ({ auth: { getUser: mockGetUser } })),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({
    getAll: vi.fn(() => []),
    set: vi.fn(),
  })),
}));

vi.mock("next/server", () => ({
  NextResponse: {
    next: () => ({ ok: true }),
  },
}));

describe("proxy middleware", () => {
  it("refreshes the session via auth.getUser", async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "http://localhost:54321";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon";

    const { proxy } = await import("@/proxy");
    await proxy({} as never);

    expect(mockGetUser).toHaveBeenCalledTimes(1);
  });
});
