import type { FormEventHandler, ReactNode } from "react";

type FormProps = {
  /**
   * Form submit handler.
   */
  onSubmit: FormEventHandler<HTMLFormElement>;
  /**
   * Displayed when the form is loading.
   */
  loading?: boolean;
  /**
   * Error message to display above the actions.
   */
  error?: string;
  /**
   * Additional class names to append.
   */
  className?: string;
  children: ReactNode;
};

/**
 * Form wrapper with loading and error display.
 */
export const Form = ({
  onSubmit,
  loading = false,
  error,
  className,
  children,
}: FormProps) => {
  return (
    <form
      onSubmit={onSubmit}
      className={["space-y-4", className ?? ""].filter(Boolean).join(" ")}
    >
      {children}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {loading ? (
        <p className="text-sm text-slate-500" aria-live="polite">
          Processing...
        </p>
      ) : null}
    </form>
  );
};
