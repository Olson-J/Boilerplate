import { describe, expect, it } from "vitest";
import { createMockSupabaseClient } from "@/__tests__/helpers/mockSupabase";

describe("auth flow (example)", () => {
  it("returns a null user by default in the mock client", async () => {
    const supabase = createMockSupabaseClient();
    const result = await supabase.auth.getUser();
    expect(result.data.user).toBeNull();
  });
});
