import { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  onBack?: () => void;
  children: ReactNode;
};

export default function ScreenShell({
  eyebrow,
  title,
  subtitle,
  onBack,
  children,
}: Props) {
  return (
    <div className="mt-8 sm:mt-10 border-4 border-black p-5 sm:p-6 bg-[#f5ead0] shadow-2xl mb-24">
      {(onBack || eyebrow || title) && (
        <div className={`${onBack ? "flex items-start justify-between gap-4" : ""}`}>
          <div className={`text-center ${onBack ? "flex-1" : ""}`}>
            {eyebrow && (
              <p className="uppercase tracking-[0.2em] text-xs sm:text-sm font-bold">
                {eyebrow}
              </p>
            )}
            <h2 className="text-3xl sm:text-4xl font-black uppercase mt-1 sm:mt-2">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-2 uppercase text-xs sm:text-sm">{subtitle}</p>
            )}
          </div>

          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="border-4 border-black px-3 sm:px-4 py-2 bg-black text-[#efe3c2] uppercase text-xs font-black shrink-0 min-h-[44px] transition-transform active:scale-95"
            >
              Back
            </button>
          )}
        </div>
      )}

      <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-5">{children}</div>
    </div>
  );
}
