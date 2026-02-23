import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen } from "@/__tests__/helpers/testUtils";
import { SignupForm } from "../../../components/auth/SignupForm";

describe("SignupForm", () => {
  it("renders signup fields", () => {
    renderWithProviders(<SignupForm onSubmit={vi.fn()} />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm password")).toBeInTheDocument();
  });

  it("submits the signup values", async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(<SignupForm onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText("Email"), "new@example.com");
    await user.type(screen.getByLabelText("Password"), "Password123!");
    await user.type(screen.getByLabelText("Confirm password"), "Password123!");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(handleSubmit).toHaveBeenCalledWith({
      email: "new@example.com",
      password: "Password123!",
      confirmPassword: "Password123!",
    });
  });

  it("displays an error message", () => {
    renderWithProviders(
      <SignupForm onSubmit={vi.fn()} error="Unable to sign up" />
    );

    expect(screen.getByText("Unable to sign up")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    renderWithProviders(<SignupForm onSubmit={vi.fn()} loading />);

    const button = screen.getByRole("button", { name: "Creating account" });
    expect(button).toBeDisabled();
  });
});
