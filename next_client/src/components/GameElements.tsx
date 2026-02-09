// export default function GameElements() {
//   return (
//     <>
//       {/* Background Gradient Blobs */}
//       <div className="fixed inset-0 -z-20 overflow-hidden">
//         <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-monopoly-green/10 rounded-full blur-[120px]"></div>
//         <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-monopoly-blue/10 rounded-full blur-[120px]"></div>
//       </div>

//       {/* Top Right - Money Bills Fan ($100, $500, $50) */}
//       <div className="game-element top-[-5%] right-[-5%] rotate-[-15deg] scale-125 z-0">
//         <div className="relative w-64 h-64">
//           <div className="money-bill-detailed bg-money-100 text-yellow-600 rotate-[10deg] top-10 left-10">
//             <div className="absolute inset-2 border-2 border-dashed border-yellow-600/30 rounded flex items-center justify-center">
//               <span className="text-4xl">$100</span>
//             </div>
//           </div>
//           <div className="money-bill-detailed bg-money-500 text-orange-600 rotate-[25deg] top-5 left-5 z-10">
//             <div className="absolute inset-2 border-2 border-dashed border-orange-600/30 rounded flex items-center justify-center">
//               <span className="text-4xl">$500</span>
//             </div>
//           </div>
//           <div className="money-bill-detailed bg-money-50 text-purple-600 rotate-[40deg] top-0 left-0 z-20">
//             <div className="absolute inset-2 border-2 border-dashed border-purple-600/30 rounded flex items-center justify-center">
//               <span className="text-4xl">$50</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Bottom Left - Money Bills Fan ($20, $10, $5) */}
//       <div className="game-element bottom-[-5%] left-[-2%] rotate-[15deg] scale-110 z-0">
//         <div className="relative w-64 h-64">
//           <div className="money-bill-detailed bg-money-20 text-green-600 rotate-[-10deg] top-0 right-0">
//             <div className="absolute inset-2 border-2 border-dashed border-green-600/30 rounded flex items-center justify-center">
//               <span className="text-4xl">$20</span>
//             </div>
//           </div>
//           <div className="money-bill-detailed bg-money-10 text-blue-500 rotate-[-25deg] top-5 right-5 z-10">
//             <div className="absolute inset-2 border-2 border-dashed border-blue-500/30 rounded flex items-center justify-center">
//               <span className="text-4xl">$10</span>
//             </div>
//           </div>
//           <div className="money-bill-detailed bg-money-5 text-red-400 rotate-[-40deg] top-10 right-10 z-20">
//             <div className="absolute inset-2 border-2 border-dashed border-red-400/30 rounded flex items-center justify-center">
//               <span className="text-4xl">$5</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* House - Top Left */}
//       <div className="game-element top-[15%] left-[8%] transform rotate-[-10deg] z-10">
//         <div className="house-3d scale-125">
//           <div className="house-roof"></div>
//           <div className="house-base">
//             <div className="house-window top-2 left-2"></div>
//             <div className="house-window top-2 right-2"></div>
//             <div className="absolute bottom-0 left-[35%] w-4 h-6 bg-green-800 rounded-t-sm"></div>
//           </div>
//         </div>
//       </div>

//       {/* House - Right Side */}
//       <div className="game-element top-[55%] right-[5%] transform rotate-[15deg] z-10">
//         <div className="house-3d scale-110">
//           <div className="house-roof"></div>
//           <div className="house-base">
//             <div className="house-window top-2 left-2"></div>
//             <div className="house-window top-2 right-2"></div>
//             <div className="absolute bottom-0 left-[35%] w-4 h-6 bg-green-800 rounded-t-sm"></div>
//           </div>
//         </div>
//       </div>

//       {/* Hotel - Bottom Right */}
//       <div className="game-element bottom-[15%] right-[15%] transform rotate-[-15deg] z-10">
//         <div className="hotel-3d scale-125">
//           <div className="hotel-roof"></div>
//           <div className="hotel-base">
//             <div className="house-window top-2 left-2"></div>
//             <div className="house-window top-2 right-2"></div>
//             <div className="house-window top-8 left-2"></div>
//             <div className="house-window top-8 right-2"></div>
//             <div className="absolute bottom-0 left-[35%] w-5 h-7 bg-red-900 rounded-t-sm border border-red-800"></div>
//           </div>
//         </div>
//       </div>

//       {/* Hotel - Top Left (Background) */}
//       <div className="game-element top-[25%] left-[20%] transform rotate-[10deg] blur-[1px] opacity-80 z-0">
//         <div className="hotel-3d scale-90">
//           <div className="hotel-roof"></div>
//           <div className="hotel-base">
//             <div className="house-window top-2 left-2"></div>
//             <div className="house-window top-2 right-2"></div>
//             <div className="absolute bottom-0 left-[35%] w-5 h-7 bg-red-900 rounded-t-sm border border-red-800"></div>
//           </div>
//         </div>
//       </div>

//       {/* Game Piece - Car (Bottom Left) */}
//       <div className="game-element bottom-[25%] left-[10%] rotate-[-10deg] z-20 hover:scale-105 transition-transform duration-300">
//         <div className="relative drop-shadow-2xl">
//           <span
//             className="material-symbols-outlined text-[140px] text-gray-300 drop-shadow-lg"
//             style={{ fontVariationSettings: "'FILL' 1, 'wght' 700" }}
//           >
//             sports_motorsports
//           </span>
//           <span
//             className="material-symbols-outlined text-[140px] text-white absolute top-0 left-0 opacity-40 mix-blend-overlay"
//             style={{ fontVariationSettings: "'FILL' 1, 'wght' 700" }}
//           >
//             sports_motorsports
//           </span>
//           <div className="absolute top-[30%] left-[30%] w-4 h-4 bg-white rounded-full blur-md opacity-80"></div>
//         </div>
//       </div>

//       {/* Dice - White Die with 4 dots (Top Right) */}
//       <div
//         className="game-element top-[40%] right-[10%] rotate-[25deg] z-20 animate-pulse"
//         style={{ animationDuration: "4s" }}
//       >
//         <div className="die-face transform rotate-12 bg-white text-black">
//           <div className="grid grid-cols-2 gap-2">
//             <div className="die-dot"></div>
//             <div className="die-dot"></div>
//             <div className="die-dot"></div>
//             <div className="die-dot"></div>
//           </div>
//         </div>
//       </div>

//       {/* Dice - Red Die with 1 dot (Top Right) */}
//       <div className="game-element top-[35%] right-[20%] rotate-[-15deg] z-10 opacity-90">
//         <div className="die-face transform -rotate-6 bg-monopoly-red border-none">
//           <div className="w-5 h-5 bg-white rounded-full shadow-inner"></div>
//         </div>
//       </div>
//     </>
//   );
// }
export default function GameElements() {
  return (
    <>
      {/* BACKGROUND BLOBS */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[5%] right-[5%] w-[80%] h-[80%] bg-monopoly-green/10 rounded-full blur-[clamp(3rem,6vw,8rem)]" />
        <div className="absolute bottom-[5%] left-[5%] w-[80%] h-[80%] bg-monopoly-blue/10 rounded-full blur-[clamp(3rem,6vw,8rem)]" />
      </div>

      {/* HOUSE – TOP LEFT (near card) */}
      <div className="absolute top-[22%] right-[88%] rotate-[-10deg]">
        <div className="house-3d scale-[1.1]">
          <div className="house-roof" />
          <div className="house-base relative w-[3.5rem] h-[3rem]">
            <div className="house-window top-1 left-1" />
            <div className="house-window top-1 right-1" />
            <div className="absolute bottom-0 left-[35%] w-3 h-4 bg-green-800 rounded-t-sm" />
          </div>
        </div>
      </div>

      {/* HOUSE – RIGHT */}
      <div className="absolute top-[55%] right-[18%] rotate-[12deg]">
        <div className="house-3d scale-[1]">
          <div className="house-roof" />
          <div className="house-base relative w-[3.5rem] h-[3rem]" />
        </div>
      </div>

      {/* HOTEL – BOTTOM RIGHT */}
      <div className="absolute bottom-[24%] right-[26%] rotate-[-14deg]">
        <div className="hotel-3d scale-[1.2]">
          <div className="hotel-roof" />
          <div className="hotel-base relative w-[4rem] h-[4rem]">
            <div className="house-window top-1 left-1" />
            <div className="house-window top-1 right-1" />
            <div className="house-window top-5 left-1" />
            <div className="house-window top-5 right-1" />
          </div>
        </div>
      </div>

      {/* TOKEN – BOTTOM LEFT */}
      <div className="absolute bottom-[28%] left-[22%] rotate-[-10deg]">
        <span
          className="material-symbols-outlined text-[clamp(3rem,6vw,7rem)] text-gray-300"
          style={{ fontVariationSettings: "'FILL' 1, 'wght' 700" }}
        >
          sports_motorsports
        </span>
      </div>

      {/* DICE – MAIN */}
      <div className="absolute top-[42%] right-[24%] rotate-[18deg]">
        <div className="die-face w-[clamp(3rem,6vw,4.5rem)] h-[clamp(3rem,6vw,4.5rem)]">
          <div className="grid grid-cols-2 gap-2">
            <div className="die-dot w-2 h-2" />
            <div className="die-dot w-2 h-2" />
            <div className="die-dot w-2 h-2" />
            <div className="die-dot w-2 h-2" />
          </div>
        </div>
      </div>

      {/* DICE – SECONDARY */}
      <div className="absolute top-[36%] right-[32%] rotate-[-14deg] opacity-80">
        <div className="die-face bg-monopoly-red border-none w-[clamp(2.5rem,5vw,4rem)] h-[clamp(2.5rem,5vw,4rem)]">
          <div className="w-2 h-2 bg-white rounded-full" />
        </div>
      </div>
    </>
  );
}
