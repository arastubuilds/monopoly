import { LeftMascot, RightMascot } from "../Mascots";

export default function HeroMascots() {
  return (
    <div className="absolute inset-0 lg:z-30 pointer-events-none">
      {/* TOP-LEFT mascot */}
      <div
        className="
          
          absolute
        
          landscape:-top-[13%]
          landscape:-left-[28%]
          landscape:-rotate-12
          
          portrait:-top-[47%]
          portrait:left-[23%] 
          portrait:rotate-0

        "
      >
        <LeftMascot />
      </div>

      {/* BOTTOM-RIGHT mascot */}
      <div
        className="
          absolute
          z-10
          landscape:top-[54%]
          landscape:-right-[18%]
          landscape:rotate-12

          portrait:-bottom-[40%]
          portrait:-right-[19%]  
          portrait:rotate-6
            
          lg:-bottom-[18%]
          lg:-right-[17%]
          lg:rotate-12
        "
      >
        <RightMascot />
      </div>
    </div>
  );
}


// export default function HeroMascots({ side }: { side: "left" | "right" }) {
//   return (
// <div className="show-landscape absolute inset-0 z-30 pointer-events-none">

//       {side === "left" && (
//         <div className="absolute -rotate-12">
//           <LeftMascot />
//         </div>
//       )}

//       {side === "right" && (
//         <div className="absolute rotate-12">
//           <RightMascot />
//         </div>
//       )}
//     </div>
//   );
// }
