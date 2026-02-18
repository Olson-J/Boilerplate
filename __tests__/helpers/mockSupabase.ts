import { vi } from "vitest";

type MockAuthResponse = {
  data: { user: { id: string; email?: string | null } | null };
  error: Error | null;
};

type MockSupabaseAuth = {
  getUser: ReturnType<typeof vi.fn>;
  signInWithPassword: ReturnType<typeof vi.fn>;
  signUp: ReturnType<typeof vi.fn>;
  signOut: ReturnType<typeof vi.fn>;
};

type MockSupabaseClient = {
  auth: MockSupabaseAuth;
};

export const createMockSupabaseClient = (): MockSupabaseClient => {
  const mockResponse: MockAuthResponse = {
    data: { user: null },
    error: null,
  };

  return {
    auth: {
      getUser: vi.fn(async () => mockResponse),
      signInWithPassword: vi.fn(async () => mockResponse),
      signUp: vi.fn(async () => mockResponse),
      signOut: vi.fn(async () => ({ error: null })),
    },
  };
};
