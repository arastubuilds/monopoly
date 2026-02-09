
import HeroMascots from "./HeroMascots";
import HeroCard from "./HeroCard";
import HeroDecor from "./HeroDecor";
import HeroEdgeDecor from "./HeroEdgeDecor";

// export default function Hero() {
//   return (
//     <section className="relative w-full flex justify-center md:translate-x-6">
//       <div
//         className="
//           relative
//           w-full
//           max-w-[1400px]
//           min-h-[60svh]
          
          
//         "
//       >
//         <HeroDecor />
//         {/* HERO CARD + MASCOTS GROUP */}
//         <div className="relative z-20 flex items-center justify-center h-full">
//           <div className="relative">
//             <HeroCard />
//             <HeroMascots />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

export default function Hero() {
  return (
    <section className="relative w-full flex justify-center md:translate-x-6">
      <div
        className="
          relative
          w-full
          max-w-[1400px]
          min-h-[60svh]
        "
      >
        {/* SCREEN-EDGE DECOR (money, deeds) */}
        <HeroEdgeDecor />

        {/* HERO-CANVAS DECOR (dice, houses, tokens) */}
        <HeroDecor />

        {/* HERO CARD + MASCOTS */}
        <div className="relative z-20 flex items-center justify-center h-full">
          <div className="relative">
            <HeroCard />
            <HeroMascots />
          </div>
        </div>
      </div>
    </section>
  );
}
