import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/helpers/testUtils";
import userEvent from "@testing-library/user-event";
import { DeleteAccountButton } from "@/components/auth/DeleteAccountButton";

// Mock useRouter
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock supabase client
const mockSignOut = vi.fn();
const mockGetUser = vi.fn();
vi.mock("@/lib/supabase/client", () => ({
  createSupabaseClient: () => ({
    auth: {
      getUser: mockGetUser,
      signOut: mockSignOut,
    },
  }),
}));

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("DeleteAccountButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUser.mockResolvedValue({
      data: { user: { id: "test-user-id" } },
      error: null,
    });
    mockSignOut.mockResolvedValue({ error: null });
  });

  it("renders the delete account button", () => {
    renderWithProviders(<DeleteAccountButton />);
    
    expect(screen.getByRole("button", { name: /delete account/i })).toBeInTheDocument();
  });

  it("shows confirmation dialog when clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<DeleteAccountButton />);
    
    const button = screen.getByRole("button", { name: /delete account/i });
    await user.click(button);
    
    expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /confirm/i })).toBeInTheDocument();
  });

  it("closes dialog when cancel is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<DeleteAccountButton />);
    
    // Open dialog
    await user.click(screen.getByRole("button", { name: /delete account/i }));
    expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
    
    // Cancel
    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(screen.queryByText(/are you sure/i)).not.toBeInTheDocument();
  });

  it("does not call delete when canceled", async () => {
    const user = userEvent.setup();
    renderWithProviders(<DeleteAccountButton />);
    
    await user.click(screen.getByRole("button", { name: /delete account/i }));
    await user.click(screen.getByRole("button", { name: /cancel/i }));
    
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("calls API to delete account when confirmed", async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    renderWithProviders(<DeleteAccountButton />);
    
    // Click delete button
    await user.click(screen.getByRole("button", { name: /delete account/i }));
    
    // Click confirm
    await user.click(screen.getByRole("button", { name: /confirm/i }));
    
    // Should call API
    expect(mockFetch).toHaveBeenCalledWith("/api/account/delete", {
      method: "DELETE",
    });
  });
});
