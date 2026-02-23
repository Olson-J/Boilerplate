import { describe, expect, it } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/helpers/testUtils";
import LoginPage from "../../app/(auth)/login/page";

describe("Login page", () => {
  it("renders the login heading and form", () => {
    renderWithProviders(<LoginPage />);

    expect(
      screen.getByRole("heading", { name: "Log in to your account" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log in" })).toBeInTheDocument();
  });
});
