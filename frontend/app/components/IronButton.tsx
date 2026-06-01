import { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

const variants = {
  primary: "bg-[#b22222] text-[#efe3c2] border-4 border-black",
  secondary: "bg-black text-[#efe3c2] border-4 border-[#b22222]",
  ghost: "bg-[#e8d8b0] text-black border-4 border-black",
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
      className={`w-full py-3 sm:py-4 uppercase font-black tracking-wider min-h-[48px] transition-transform active:scale-[0.98] disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
