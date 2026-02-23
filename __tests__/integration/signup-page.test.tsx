import { describe, expect, it } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/helpers/testUtils";
import SignupPage from "../../app/(auth)/signup/page";

describe("Signup page", () => {
  it("renders the signup heading and form", () => {
    renderWithProviders(<SignupPage />);

    expect(
      screen.getByRole("heading", { name: "Create your account" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create account" })
    ).toBeInTheDocument();
  });
});
