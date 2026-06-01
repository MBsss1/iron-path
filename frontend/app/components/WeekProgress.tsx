type Props = {
  week: number;
};

export default function WeekProgress({ week }: Props) {
  const progress = (week / 24) * 100;

  return (
    <div className="w-full mt-4 border-2 border-black p-3 bg-[#e8d8b0]">
      <div className="flex justify-between text-xs uppercase font-black">
        <span>24 Week Path</span>
        <span>Week {week} / 24</span>
      </div>

      <div className="w-full h-4 border-2 border-black mt-2 bg-[#f5ead0]">
        <div
          className="h-full bg-[#b22222] transition-all duration-500"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
}