import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
}

const variantClasses: Record<string, string> = {
  primary: "bg-navy text-white hover:bg-navy-light",
  secondary: "bg-white text-navy border border-border hover:bg-surface",
  ghost: "bg-transparent text-graphite hover:bg-surface",
  danger: "bg-white text-red-700 border border-red-200 hover:bg-red-50",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", ...props }, ref) => (
    <button
      ref={ref}
      className={`focus-ring inline-flex items-center justify-center gap-2 rounded-sm px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
      {...props}
    />
  )
);
Button.displayName = "Button";
