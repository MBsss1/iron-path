type Props = {
  onReset: () => void;
  onTest?: () => void;
};

export default function DevPanel({ onReset }: Props) {
  return (
    <button
      onClick={onReset}
      className="fixed top-4 right-4 z-40 bg-black text-[#efe3c2] border-2 border-[#b22222] px-3 py-2 text-xs uppercase font-black"
    >
      Reset
    </button>
  );
}