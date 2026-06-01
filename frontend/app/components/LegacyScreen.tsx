import { SeasonRecord } from "../hooks/useSeasons";

type Props = {
  seasons: SeasonRecord[];
};

export default function LegacyScreen({ seasons }: Props) {
  return (
    <div className="mt-10 border-4 border-black p-6 bg-[#f5ead0] shadow-2xl mb-24">
      <div className="text-center">
        <p className="uppercase tracking-[0.2em] text-sm font-bold">Legacy</p>
        <h2 className="text-4xl font-black uppercase mt-2">Completed Seasons</h2>
        <p className="mt-2 uppercase text-sm">Your recorded seasons and milestones.</p>
      </div>

      <div className="mt-8 space-y-3">
        {seasons.length === 0 && (
          <div className="border-2 border-black p-4 bg-[#e8d8b0] text-center">
            <p className="uppercase font-black">No seasons completed yet.</p>
          </div>
        )}

        {seasons.map((s) => (
          <div key={s.id} className="border-2 border-black p-4 bg-black text-[#efe3c2]">
            <div className="flex justify-between">
              <div>
                <p className="uppercase text-xs">Season {s.id}</p>
                <p className="font-black text-lg mt-1">Completed {new Date(s.completedAt).toLocaleDateString()}</p>
              </div>

              <div className="text-right">
                <p className="uppercase text-xs">Week</p>
                <p className="font-black text-lg mt-1">{s.week}</p>
                <p className="uppercase text-xs mt-2">Level</p>
                <p className="font-black">{s.levelAtCompletion ?? "-"}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
