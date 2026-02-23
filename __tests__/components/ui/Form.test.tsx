import type { FormEvent } from "react";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders, screen } from "@/__tests__/helpers/testUtils";
import { Form } from "../../../components/ui/Form";

describe("Form", () => {
  it("renders children inside a form", () => {
    renderWithProviders(
      <Form onSubmit={vi.fn()}>
        <button type="submit">Submit</button>
      </Form>
    );

    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("calls onSubmit when submitted", () => {
    const handleSubmit = vi.fn((event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
    });

    renderWithProviders(
      <Form onSubmit={handleSubmit}>
        <button type="submit">Submit</button>
      </Form>
    );

    screen.getByRole("button", { name: "Submit" }).click();

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it("shows error text when provided", () => {
    renderWithProviders(
      <Form onSubmit={vi.fn()} error="Something went wrong">
        <button type="submit">Submit</button>
      </Form>
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("shows loading state when requested", () => {
    renderWithProviders(
      <Form onSubmit={vi.fn()} loading>
        <button type="submit">Submit</button>
      </Form>
    );

    expect(screen.getByText("Processing...")).toBeInTheDocument();
  });
});
