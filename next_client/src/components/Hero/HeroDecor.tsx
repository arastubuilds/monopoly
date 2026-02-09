import GameElements from "../GameElements";

export default function HeroDecor() {
  return (
    <div
      className="
        absolute inset-0
        z-0
        pointer-events-none
        // origin-center
        scale-[clamp(0.7,1vw+0.5,1)]
      "
    >
      <GameElements />
    </div>
  );
}
