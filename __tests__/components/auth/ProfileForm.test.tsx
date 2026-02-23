import { describe, expect, it, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen } from "@/__tests__/helpers/testUtils";
import { ProfileForm } from "../../../components/auth/ProfileForm";

const { mockUploadAvatar, mockSupabaseClient } = vi.hoisted(() => {
  return {
    mockUploadAvatar: vi.fn(),
    mockSupabaseClient: {
      auth: {
        getUser: vi.fn(),
      },
      from: vi.fn(),
      storage: {
        from: vi.fn(),
      },
    },
  };
});

vi.mock("@/lib/utils/uploadAvatar", () => ({
  uploadAvatar: mockUploadAvatar,
}));

vi.mock("@/lib/supabase/client", () => ({
  createSupabaseClient: vi.fn(() => mockSupabaseClient),
}));

describe("ProfileForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUploadAvatar.mockResolvedValue({
      url: "https://example.com/avatar.png",
    });

    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: { id: "test-user-id" } },
    });

    mockSupabaseClient.from.mockReturnValue({
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      }),
    });

    mockSupabaseClient.storage.from.mockReturnValue({
      upload: vi.fn().mockResolvedValue({ error: null }),
      getPublicUrl: vi.fn().mockReturnValue({
        data: { publicUrl: "https://example.com/avatar.png" },
      }),
    });
  });

  it("renders full name and avatar inputs", () => {
    renderWithProviders(<ProfileForm onSubmit={vi.fn()} />);

    expect(screen.getByLabelText("Full name")).toBeInTheDocument();
    expect(screen.getByLabelText("Avatar")).toBeInTheDocument();
  });

  it("submits profile values", async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();
    const file = new File(["avatar"], "avatar.png", { type: "image/png" });

    renderWithProviders(<ProfileForm onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText("Full name"), "Ada Lovelace");
    await user.upload(screen.getByLabelText("Avatar"), file);
    await user.click(screen.getByRole("button", { name: "Save profile" }));

    // Wait for async operations
    await new Promise((resolve) => setTimeout(resolve, 200));

    expect(handleSubmit).toHaveBeenCalledWith({
      fullName: "Ada Lovelace",
      avatarFile: file,
    });
  });

  it("shows error and success messages", () => {
    renderWithProviders(
      <ProfileForm onSubmit={vi.fn()} error="Save failed" success="Saved" />
    );

    expect(screen.getByText("Save failed")).toBeInTheDocument();
    expect(screen.getByText("Saved")).toBeInTheDocument();
  });

  it("disables submit when loading", () => {
    renderWithProviders(<ProfileForm onSubmit={vi.fn()} loading />);

    const button = screen.getByRole("button", { name: "Saving" });
    expect(button).toBeDisabled();
  });
});
