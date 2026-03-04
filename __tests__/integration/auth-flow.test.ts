import { describe, expect, it } from "vitest";
import { createMockSupabaseClient } from "@/__tests__/helpers/mockSupabase";

type MockAuthResponse = {
  data: { user: { id: string; email?: string | null } | null };
  error: Error | null;
};

describe("auth flow (example)", () => {
  it("returns a null user by default in the mock client", async () => {
    const supabase = createMockSupabaseClient();
    const result = (await supabase.auth.getUser()) as MockAuthResponse;
    expect(result.data.user).toBeNull();
  });
});
