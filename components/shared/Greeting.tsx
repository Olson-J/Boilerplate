import type { ReactNode } from "react";

type GreetingProps = {
  name: string;
  children?: ReactNode;
};

/**
 * Simple greeting component for testing examples.
 */
export function Greeting({ name, children }: GreetingProps) {
  return (
    <div>
      <p>{`Hello, ${name}!`}</p>
      {children}
    </div>
  );
}
