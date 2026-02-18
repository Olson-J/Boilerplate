import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";

type WrapperProps = { children: ReactNode };

const Wrapper = ({ children }: WrapperProps) => children;

export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: Wrapper, ...options });

export * from "@testing-library/react";
