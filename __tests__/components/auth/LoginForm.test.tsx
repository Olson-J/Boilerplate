import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen } from "@/__tests__/helpers/testUtils";
import { LoginForm } from "../../../components/auth/LoginForm";

describe("LoginForm", () => {
  it("renders email and password fields", () => {
    renderWithProviders(<LoginForm onSubmit={vi.fn()} />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("submits email and password to the handler", async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(<LoginForm onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText("Email"), "user@example.com");
    await user.type(screen.getByLabelText("Password"), "Password123!");
    await user.click(screen.getByRole("button", { name: "Log in" }));

    expect(handleSubmit).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "Password123!",
    });
  });

  it("shows an error message when provided", () => {
    renderWithProviders(
      <LoginForm onSubmit={vi.fn()} error="Invalid credentials" />
    );

    expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    renderWithProviders(<LoginForm onSubmit={vi.fn()} loading />);

    const button = screen.getByRole("button", { name: "Logging in" });
    expect(button).toBeDisabled();
  });
});
