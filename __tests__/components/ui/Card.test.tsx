import { describe, expect, it } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/helpers/testUtils";
import { Card } from "@/components/ui/Card";

describe("Card", () => {
  it("renders title and description when provided", () => {
    renderWithProviders(
      <Card title="Profile" description="Manage your account">
        <p>Content</p>
      </Card>
    );

    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Manage your account")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("renders children without optional header", () => {
    renderWithProviders(
      <Card>
        <p>Body only</p>
      </Card>
    );

    expect(screen.getByText("Body only")).toBeInTheDocument();
  });
});
