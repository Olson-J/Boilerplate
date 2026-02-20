import { describe, expect, it } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/helpers/testUtils";
import { Button } from "@/components/ui/Button";

describe("Button", () => {
  it("renders the provided label", () => {
    renderWithProviders(<Button>Save changes</Button>);

    expect(
      screen.getByRole("button", { name: "Save changes" })
    ).toBeInTheDocument();
  });

  it("applies the primary variant by default", () => {
    renderWithProviders(<Button>Primary</Button>);

    const button = screen.getByRole("button", { name: "Primary" });
    expect(button.className).toContain("btn-primary");
  });

  it("applies the requested variant", () => {
    renderWithProviders(<Button variant="danger">Delete</Button>);

    const button = screen.getByRole("button", { name: "Delete" });
    expect(button.className).toContain("btn-danger");
  });

  it("respects the disabled state", () => {
    renderWithProviders(<Button disabled>Disabled</Button>);

    const button = screen.getByRole("button", { name: "Disabled" });
    expect(button).toBeDisabled();
  });

  it("shows the loading label and disables the button", () => {
    renderWithProviders(
      <Button loading loadingLabel="Saving">
        Save
      </Button>
    );

    const button = screen.getByRole("button", { name: "Saving" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
  });
});
