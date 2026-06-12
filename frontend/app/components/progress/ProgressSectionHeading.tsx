"use client";

type Props = {
  title: string;
  subtitle?: string;
};

export default function ProgressSectionHeading({ title, subtitle }: Props) {
  return (
    <div className="mt-8 mb-3 first:mt-0">
      <h3 className="text-lg font-black uppercase text-iron-gold border-b border-iron-border pb-2">
        {title}
      </h3>
      {subtitle && (
        <p className="text-xs text-iron-muted mt-1 uppercase">{subtitle}</p>
      )}
    </div>
  );
}
