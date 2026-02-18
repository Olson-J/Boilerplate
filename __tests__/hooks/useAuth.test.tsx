import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { User } from "@supabase/supabase-js";

const mockGetUser = vi.fn();
const mockOnAuthStateChange = vi.fn();
const mockSignOut = vi.fn();

vi.mock("@/lib/supabase/client", () => ({
  createSupabaseClient: () => ({
    auth: {
      getUser: mockGetUser,
      onAuthStateChange: mockOnAuthStateChange,
      signOut: mockSignOut,
    },
  }),
}));

describe("useAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns user and loading state", async () => {
    const user = { id: "user-1", email: "test@example.com" } as User;
    mockGetUser.mockResolvedValueOnce({ data: { user }, error: null });
    mockOnAuthStateChange.mockReturnValueOnce({
      data: { subscription: { unsubscribe: vi.fn() } },
    });

    const { useAuth } = await import("@/lib/hooks/useAuth");
    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual(user);
    expect(result.current.error).toBeNull();
  });

  it("sets error when getUser fails", async () => {
    mockGetUser.mockResolvedValueOnce({
      data: { user: null },
      error: new Error("Auth error"),
    });
    mockOnAuthStateChange.mockReturnValueOnce({
      data: { subscription: { unsubscribe: vi.fn() } },
    });

    const { useAuth } = await import("@/lib/hooks/useAuth");
    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.error?.message).toBe("Auth error");
  });

  it("calls signOut and clears user", async () => {
    const user = { id: "user-2", email: "test@example.com" } as User;
    mockGetUser.mockResolvedValueOnce({ data: { user }, error: null });
    mockSignOut.mockResolvedValueOnce({ error: null });
    mockOnAuthStateChange.mockReturnValueOnce({
      data: { subscription: { unsubscribe: vi.fn() } },
    });

    const { useAuth } = await import("@/lib/hooks/useAuth");
    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.signOut();
    });

    expect(mockSignOut).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(result.current.user).toBeNull();
    });
  });
});
