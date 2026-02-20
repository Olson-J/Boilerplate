import { describe, expect, it, vi } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/helpers/testUtils";

vi.mock("@/lib/auth/server", () => ({
  getUser: vi.fn(async () => null),
}));

import Home from "@/app/page";

describe("Home page", () => {
  it("renders the welcome message", async () => {
    renderWithProviders(await Home());

    expect(
      screen.getByRole("heading", {
        name: "Welcome to the Next.js + Supabase starter",
      })
    ).toBeInTheDocument();
  });

  it("provides auth navigation links", async () => {
    renderWithProviders(await Home());

    expect(screen.getByRole("link", { name: "Log in" })).toHaveAttribute(
      "href",
      "/login"
    );
    expect(screen.getByRole("link", { name: "Sign up" })).toHaveAttribute(
      "href",
      "/signup"
    );
  });
});
