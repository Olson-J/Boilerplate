import { describe, expect, it } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/helpers/testUtils";
import { Greeting } from "@/components/shared/Greeting";

describe("Greeting", () => {
  it("renders a greeting message", () => {
    renderWithProviders(<Greeting name="Julie" />);
    expect(screen.getByText("Hello, Julie!")).toBeInTheDocument();
  });

  it("renders children", () => {
    renderWithProviders(
      <Greeting name="Julie">
        <span>Welcome back</span>
      </Greeting>
    );
    expect(screen.getByText("Welcome back")).toBeInTheDocument();
  });
});
