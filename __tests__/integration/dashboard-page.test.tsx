import { describe, expect, it, vi } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/helpers/testUtils";

vi.mock("@/lib/auth/server", () => ({
  requireAuth: vi.fn(async () => ({ id: "user-1", email: "user@example.com" })),
}));

import DashboardPage from "@/app/(dashboard)/dashboard/page";

describe("Dashboard page", () => {
  it("renders the dashboard heading and user email", async () => {
    renderWithProviders(await DashboardPage());

    expect(
      screen.getByRole("heading", { name: "Dashboard" })
    ).toBeInTheDocument();
    expect(screen.getByText("user@example.com")).toBeInTheDocument();
  });
});
