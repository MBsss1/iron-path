import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  variant?: "paper" | "dark" | "tan";
  className?: string;
};

const variants = {
  paper: "bg-[#f5ead0]",
  dark: "bg-black text-[#efe3c2]",
  tan: "bg-[#e8d8b0]",
};

export default function IronCard({
  children,
  variant = "tan",
  className = "",
}: Props) {
  return (
    <div
      className={`border-2 border-black p-4 sm:p-5 ${variants[variant]} ${className}`}
    >
      {children}
    </div>
  );
}
