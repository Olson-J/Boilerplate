import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen } from "@/__tests__/helpers/testUtils";

vi.mock("@/lib/auth/server", () => ({
  requireAuth: vi.fn(async () => ({
    id: "user-1",
    email: "user@example.com",
    user_metadata: { full_name: "Ada Lovelace" },
  })),
}));

import ProfilePage from "@/app/(dashboard)/profile/page";

describe("Profile page", () => {
  it("renders the profile heading and form", async () => {
    renderWithProviders(await ProfilePage());

    expect(
      screen.getByRole("heading", { name: "Your profile" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Full name")).toBeInTheDocument();
    expect(screen.getByLabelText("Avatar")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Save profile" })
    ).toBeInTheDocument();
  });

  it("supports profile updates and avatar uploads", async () => {
    const user = userEvent.setup();
    const file = new File(["avatar"], "avatar.png", { type: "image/png" });

    renderWithProviders(await ProfilePage());

    await user.clear(screen.getByLabelText("Full name"));
    await user.type(screen.getByLabelText("Full name"), "Grace Hopper");
    await user.upload(screen.getByLabelText("Avatar"), file);
    await user.click(screen.getByRole("button", { name: "Save profile" }));

    expect(screen.getByText("Profile updated.")).toBeInTheDocument();
  });
});
