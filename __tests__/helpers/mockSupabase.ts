import { vi } from "vitest";

type MockAuthResponse = {
  data: { user: { id: string; email?: string | null } | null };
  error: Error | null;
};

type MockSupabaseAuth = {
  getUser: ReturnType<typeof vi.fn<[], Promise<MockAuthResponse>>>;
  signInWithPassword: ReturnType<typeof vi.fn<[], Promise<MockAuthResponse>>>;
  signUp: ReturnType<typeof vi.fn<[], Promise<MockAuthResponse>>>;
  signOut: ReturnType<typeof vi.fn<[], Promise<{ error: null }>>>;
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
      getUser: vi.fn<[], Promise<MockAuthResponse>>(async () => mockResponse),
      signInWithPassword: vi.fn<[], Promise<MockAuthResponse>>(async () => mockResponse),
      signUp: vi.fn<[], Promise<MockAuthResponse>>(async () => mockResponse),
      signOut: vi.fn<[], Promise<{ error: null }>>(async () => ({ error: null })),
    },
  };
};
