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
  describe.skip("profiles RLS policies (integration)", () => {});
}

const createAdminClient = (): AdminClient =>
  createClient<Database>(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

const createAnonClient = () =>
  createClient<Database>(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

const createTestUser = async (admin: AdminClient): Promise<TestUser> => {
  const email = `rls-${randomUUID()}@example.com`;
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

const signIn = async (email: string, password: string) => {
  const client = createAnonClient();
  const { error } = await client.auth.signInWithPassword({ email, password });

  if (error) {
    throw new Error(error.message);
  }

  return client;
};

if (hasEnv) {
  describe("profiles RLS policies (integration)", () => {
  const admin = createAdminClient();
  const createdUserIds: string[] = [];

  afterAll(async () => {
    await Promise.all(
      createdUserIds.map((userId) => admin.auth.admin.deleteUser(userId))
    );
  });

  it("allows owners to read and update their own profile", async () => {
    const user = await createTestUser(admin);
    createdUserIds.push(user.id);

    const client = await signIn(user.email, user.password);

    const { data: readData, error: readError } = await client
      .from("profiles")
      .select("id, email")
      .eq("id", user.id);

    expect(readError).toBeNull();
    expect(readData).toHaveLength(1);
    expect(readData?.[0]?.id).toBe(user.id);

    const { data: updateData, error: updateError } = await client
      .from("profiles")
      .update({ full_name: "Profile Owner" })
      .eq("id", user.id)
      .select("full_name");

    expect(updateError).toBeNull();
    expect(updateData).toHaveLength(1);
    expect(updateData?.[0]?.full_name).toBe("Profile Owner");
  });

  it("prevents access to another user's profile", async () => {
    const owner = await createTestUser(admin);
    const other = await createTestUser(admin);
    createdUserIds.push(owner.id, other.id);

    const ownerClient = await signIn(owner.email, owner.password);

    const { data: readData, error: readError } = await ownerClient
      .from("profiles")
      .select("id")
      .eq("id", other.id);

    expect(readError).toBeNull();
    expect(readData).toHaveLength(0);

    const { data: updateData, error: updateError } = await ownerClient
      .from("profiles")
      .update({ full_name: "Should Not Update" })
      .eq("id", other.id)
      .select("full_name");

    expect(updateError).toBeNull();
    expect(updateData).toHaveLength(0);
  });
  });
}
