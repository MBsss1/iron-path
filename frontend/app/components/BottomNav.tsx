type Props = {
  screen: string;
  setScreen: (screen: string) => void;
};

export default function BottomNav({ screen, setScreen }: Props) {
  const itemClass = (name: string) => `
    relative flex flex-col items-center py-3 px-4 flex-1 text-[#efe3c2] uppercase text-xs font-bold tracking-wider
    ${screen === name ? "text-[#b22222]" : ""}
  `;

  const indicatorClass = (name: string) =>
    screen === name ? "absolute top-0 left-0 right-0 h-1 bg-[#b22222]" : "";

  return (
    <div className="fixed bottom-0 left-0 w-full bg-black border-t-4 border-[#b22222]">
      <div className="max-w-md mx-auto flex justify-around items-stretch">
        <button onClick={() => setScreen("hero")} className={itemClass("hero")}>
          <div className={indicatorClass("hero")} />
          <span className="text-xl mt-1">★</span>
          <span className="mt-1">Home</span>
        </button>

        <button onClick={() => setScreen("today")} className={itemClass("today")}>
          <div className={indicatorClass("today")} />
          <span className="text-xl mt-1">✓</span>
          <span className="mt-1">Today</span>
        </button>

        <button onClick={() => setScreen("training")} className={itemClass("training")}>
          <div className={indicatorClass("training")} />
          <span className="text-xl mt-1">💪</span>
          <span className="mt-1">Train</span>
        </button>

        <button onClick={() => setScreen("nutrition")} className={itemClass("nutrition")}>
          <div className={indicatorClass("nutrition")} />
          <span className="text-xl mt-1">🍖</span>
          <span className="mt-1">Food</span>
        </button>

        <button onClick={() => setScreen("more")} className={itemClass("more")}>
          <div className={indicatorClass("more")} />
          <span className="text-xl mt-1">⋮</span>
          <span className="mt-1">More</span>
        </button>
      </div>
    </div>
  );
}
