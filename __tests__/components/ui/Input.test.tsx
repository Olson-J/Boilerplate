import { describe, expect, it } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/helpers/testUtils";
import { Input } from "../../../components/ui/Input";

describe("Input", () => {
  it("renders a label when provided", () => {
    renderWithProviders(
      <Input id="email" label="Email" placeholder="you@example.com" />
    );

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("uses the provided input type", () => {
    renderWithProviders(<Input id="password" type="password" label="Password" />);

    const input = screen.getByLabelText("Password") as HTMLInputElement;
    expect(input.type).toBe("password");
  });

  it("renders an error message and marks input invalid", () => {
    renderWithProviders(
      <Input id="name" label="Full name" error="Name is required" />
    );

    const input = screen.getByLabelText("Full name");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input.className).toContain("input-error");
    expect(screen.getByText("Name is required")).toBeInTheDocument();
  });
});
