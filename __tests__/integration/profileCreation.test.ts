import { randomUUID } from "node:crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { afterAll, describe, expect, it } from "vitest";
import type { Database } from "@/lib/types/database";

type AdminClient = SupabaseClient<Database>;

type TestUser = {
  id: string;
  email: string;
  password: string;
};

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

const hasEnv = Boolean(url && anonKey && serviceRoleKey);
if (!hasEnv) {
  describe.skip("profiles trigger (integration)", () => {});
}

const createAdminClient = (): AdminClient =>
  createClient<Database>(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

const createTestUser = async (admin: AdminClient): Promise<TestUser> => {
  const email = `profile-${randomUUID()}@example.com`;
  const password = `Test!${randomUUID()}`;
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error || !data.user) {
    throw new Error(error?.message ?? "Failed to create test user.");
  }

  return { id: data.user.id, email, password };
};

if (hasEnv) {
  describe("profiles trigger (integration)", () => {
  const admin = createAdminClient();
  const createdUserIds: string[] = [];

  afterAll(async () => {
    await Promise.all(
      createdUserIds.map((userId) => admin.auth.admin.deleteUser(userId))
    );
  });

  it("creates a profile row when a user signs up", async () => {
    const testUser = await createTestUser(admin);
    createdUserIds.push(testUser.id);

    const { data, error } = await admin
      .from("profiles")
      .select("id, email")
      .eq("id", testUser.id)
      .single();

    expect(error).toBeNull();
    expect(data).not.toBeNull();
    expect(data?.id).toBe(testUser.id);
    expect(data?.email).toBe(testUser.email);
  });
  });
}
