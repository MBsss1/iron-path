import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  variant?: "paper" | "dark" | "tan";
  className?: string;
};

const variants = {
  paper: "iron-card-surface",
  dark: "iron-card-panel",
  tan: "iron-card-raised",
};

export default function IronCard({
  children,
  variant = "tan",
  className = "",
}: Props) {
  return (
    <div className={`p-4 sm:p-5 ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
}
