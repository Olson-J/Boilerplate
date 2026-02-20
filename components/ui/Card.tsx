import type { ReactNode } from "react";

type CardProps = {
  /**
   * Optional card title.
   */
  title?: string;
  /**
   * Optional description displayed beneath the title.
   */
  description?: string;
  /**
   * Additional class names to append.
   */
  className?: string;
  children: ReactNode;
};

/**
 * Card container with optional header metadata.
 */
export const Card = ({ title, description, className, children }: CardProps) => {
  return (
    <section
      className={[
        "rounded-lg border border-slate-200 bg-white p-6 shadow-sm",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {title || description ? (
        <header className="mb-4 space-y-1">
          {title ? (
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          ) : null}
          {description ? (
            <p className="text-sm text-slate-500">{description}</p>
          ) : null}
        </header>
      ) : null}
      {children}
    </section>
  );
};
