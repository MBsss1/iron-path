type Props = { week: number };

export default function SeasonProgress({ week }: Props) {
  const pct = Math.min(100, Math.round((week / 24) * 100));

  return (
    <div className="mt-4 border-2 border-black p-4 bg-[#e8d8b0]">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-black uppercase">Season Progress</h4>
        <p className="text-sm font-bold uppercase">{pct}%</p>
      </div>

      <div className="w-full h-4 border-2 border-black mt-3 bg-[#f5ead0]">
        <div
          className="h-full bg-[#b22222] transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
