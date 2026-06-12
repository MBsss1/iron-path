import { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

const variants = {
  primary: "iron-interactive iron-btn-primary",
  secondary: "iron-interactive iron-btn-secondary",
  ghost: "iron-interactive iron-btn-ghost",
  danger: "iron-interactive iron-btn-danger",
};

export default function IronButton({
  variant = "primary",
  className = "",
  children,
  ...props
}: Props) {
  return (
    <button
      type="button"
      className={`w-full py-3 sm:py-4 text-sm font-semibold min-h-[48px] rounded-sm disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
