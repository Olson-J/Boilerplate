import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen } from "@/__tests__/helpers/testUtils";
import { ProfileForm } from "@/components/auth/ProfileForm";

describe("ProfileForm", () => {
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
