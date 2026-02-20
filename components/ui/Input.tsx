import { forwardRef, useId, type InputHTMLAttributes } from "react";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "className"> & {
  /**
   * Optional label to display above the input.
   */
  label?: string;
  /**
   * Error message to display under the input.
   */
  error?: string;
  /**
   * Additional class names to append.
   */
  className?: string;
};

const baseClass =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200";

const errorClass = "input-error border-red-500 focus:border-red-500 focus:ring-red-200";

/**
 * Reusable input component with label and error support.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ id, label, error, className, type = "text", ...props }, ref) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    const errorId = error ? `${inputId}-error` : undefined;

    return (
      <div className="space-y-1">
        {label ? (
          <label className="text-sm font-medium text-slate-700" htmlFor={inputId}>
            {label}
          </label>
        ) : null}
        <input
          id={inputId}
          ref={ref}
          type={type}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={errorId}
          className={[baseClass, error ? errorClass : "", className ?? ""]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />
        {error ? (
          <p id={errorId} className="text-xs text-red-600">
            {error}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
