import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "danger";

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
  /**
   * Visual style for the button.
   */
  variant?: ButtonVariant;
  /**
   * Whether the button should show a loading state.
   */
  loading?: boolean;
  /**
   * Label displayed while loading. Defaults to children.
   */
  loadingLabel?: string;
  /**
   * Additional class names to append.
   */
  className?: string;
  children: ReactNode;
};

const baseClass =
  "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "btn-primary bg-blue-600 text-white hover:bg-blue-500",
  secondary: "btn-secondary border border-slate-300 text-slate-900 hover:bg-slate-100",
  danger: "btn-danger bg-red-600 text-white hover:bg-red-500",
};

const disabledClasses = "opacity-60 cursor-not-allowed";

/**
 * Reusable button component with variants and loading state.
 */
export const Button = ({
  variant = "primary",
  loading = false,
  loadingLabel,
  disabled,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) => {
  const isDisabled = disabled || loading;
  const label = loading ? loadingLabel ?? children : children;

  return (
    <button
      type={type}
      aria-busy={loading ? "true" : "false"}
      disabled={isDisabled}
      className={[
        baseClass,
        variantClasses[variant],
        isDisabled ? disabledClasses : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {label}
    </button>
  );
};
