export function LeftMascot() {
  return (
    <div
      className="
        relative
        w-[16rem] h-[20rem]
        origin-center
        scale-[clamp(0.6,1vw+0.5,1)]
      "
    >
      {/* Top Hat */}
      <div className="absolute top-0 left-[16%] w-40 h-32 bg-gray-800 rounded-t-lg z-20 border-b-8 border-gray-900" />
      <div className="absolute top-[7.5rem] left-0 w-60 h-4 bg-gray-800 rounded-full z-20 shadow-lg" />

      {/* Face */}
      <div className="absolute top-28 left-[17%] w-40 h-40 bg-[#FFCCBC] rounded-full z-10 border-4 border-[#E64A19] shadow-inner flex items-center justify-center">
        <div className="absolute top-10 right-8 w-12 h-12 rounded-full border-4 border-gold bg-white/30 backdrop-blur-sm" />
        <div className="absolute top-12 left-10 w-3 h-3 bg-black rounded-full" />
        <div className="absolute bottom-10 w-24 h-6 bg-white rounded-full shadow-sm" />
        <div className="absolute bottom-5 w-10 h-4 bg-red-400 rounded-full" />
      </div>

      {/* Suit */}
      <div className="absolute bottom-[-3.75rem] left-[10%] w-48 h-40 bg-dark-blue rounded-[3rem] z-0 shadow-xl border-4 border-dark-blue">
        <div className="w-full h-full flex justify-center pt-4">
          <div className="w-8 h-24 bg-white clip-path-polygon" />
          <div className="absolute top-10 w-4 h-4 bg-red-600 rotate-45" />
        </div>
      </div>
    </div>
  );
}
export function RightMascot() {
  return (
    <div
      className="
        relative
        w-[14rem] h-[16.25rem]
        origin-center
        scale-[clamp(0.6,1vw+0.5,1)]
      "
    >
      {/* Head */}
      <div className="absolute top-10 left-[10%] w-40 h-40 bg-[#D7CCC8] rounded-[2rem] z-10 border-4 border-[#8D6E63] shadow-inner overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#A1887F]/20" />

        <div className="absolute -top-4 -left-4 w-16 h-20 bg-[#8D6E63] rounded-full rotate-[-20deg]" />
        <div className="absolute -top-4 -right-4 w-16 h-20 bg-[#8D6E63] rounded-full rotate-[20deg]" />

        <div className="absolute top-14 left-8 w-6 h-8 bg-black rounded-full">
          <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full" />
        </div>
        <div className="absolute top-14 right-8 w-6 h-8 bg-black rounded-full">
          <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full" />
        </div>

        <div className="absolute bottom-8 left-[30%] w-16 h-12 bg-white rounded-xl flex justify-center pt-2">
          <div className="w-6 h-4 bg-black rounded-full" />
        </div>

        <div className="absolute -bottom-2 left-[43%] w-6 h-8 bg-pink-400 rounded-b-full border-2 border-pink-500" />
      </div>

      {/* Collar */}
      <div className="absolute top-[11.875rem] left-[18%] w-32 h-6 bg-monopoly-red rounded-full z-20 shadow-md flex items-center justify-center">
        <div className="w-4 h-4 rounded-full bg-gold border border-yellow-600" />
      </div>

      {/* Speech Bubble */}
      <div className="absolute bg-white px-4 py-2 rounded-2xl shadow-lg border animate-bounce">
        <p className="font-display font-bold text-dark-blue text-sm">
          Roll the dice!
        </p>
      </div>
    </div>
  );
}

// export function LeftMascot() {
//   return (
//     <div
//       className="
//         relative
//         w-[256px] h-[320px]
//         origin-center
//         scale-[0.75]
//         sm:scale-[0.85]
//         md:scale-100
//         lg:scale-100
//       "
//     >
//       {/* Top Hat */}
//       <div className="absolute top-0 left-[16%] w-40 h-32 bg-gray-800 rounded-t-lg z-20 border-b-8 border-gray-900" />
//       <div className="absolute top-[120px] left-0 w-60 h-4 bg-gray-800 rounded-full z-20 shadow-lg" />

//       {/* Face */}
//       <div className="absolute top-28 left-[17%] w-40 h-40 bg-[#FFCCBC] rounded-full z-10 border-4 border-[#E64A19] shadow-inner flex items-center justify-center">
//         <div className="absolute top-10 right-8 w-12 h-12 rounded-full border-4 border-gold bg-white/30 backdrop-blur-sm" />
//         <div className="absolute top-12 left-10 w-3 h-3 bg-black rounded-full" />
//         <div className="absolute bottom-10 w-24 h-6 bg-white rounded-full shadow-sm" />
//         <div className="absolute bottom-5 w-10 h-4 bg-red-400 rounded-full" />
//       </div>

//       {/* Suit */}
//       <div className="absolute bottom-[-60px] left-[10%] w-48 h-40 bg-dark-blue rounded-t-[3rem] z-0 shadow-xl border-4 border-blue-900">
//         <div className="w-full h-full flex justify-center pt-4">
//           <div className="w-8 h-24 bg-white clip-path-polygon" />
//           <div className="absolute top-10 w-4 h-4 bg-red-600 rotate-45" />
//         </div>
//       </div>
//     </div>
//   );
// }
// export function RightMascot() {
//   return (
//     <div
//       className="
//         relative
//         w-[224px] h-[260px]
//         origin-center
//         scale-[0.75]
//         sm:scale-[0.85]
//         md:scale-100
//         lg:scale-100
//       "
//     >
//       {/* Head */}
//       <div className="absolute top-10 left-[10%] w-40 h-40 bg-[#D7CCC8] rounded-[2rem] z-10 border-4 border-[#8D6E63] shadow-inner overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#A1887F]/20" />

//         <div className="absolute -top-4 -left-4 w-16 h-20 bg-[#8D6E63] rounded-full rotate-[-20deg]" />
//         <div className="absolute -top-4 -right-4 w-16 h-20 bg-[#8D6E63] rounded-full rotate-[20deg]" />

//         <div className="absolute top-14 left-8 w-6 h-8 bg-black rounded-full">
//           <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full" />
//         </div>
//         <div className="absolute top-14 right-8 w-6 h-8 bg-black rounded-full">
//           <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full" />
//         </div>

//         <div className="absolute bottom-8 left-[30%] w-16 h-12 bg-white rounded-xl flex justify-center pt-2">
//           <div className="w-6 h-4 bg-black rounded-full" />
//         </div>

//         <div className="absolute -bottom-2 left-[43%] w-6 h-8 bg-pink-400 rounded-b-full border-2 border-pink-500" />
//       </div>

//       {/* Collar */}
//       <div className="absolute top-[190px] left-[18%] w-32 h-6 bg-monopoly-red rounded-full z-20 shadow-md flex items-center justify-center">
//         <div className="w-4 h-4 rounded-full bg-gold border border-yellow-600" />
//       </div>

//       {/* Speech Bubble */}
//       <div className="absolute -top-16 -left-10 bg-white px-4 py-2 rounded-2xl shadow-lg border animate-bounce">
//         <p className="font-display font-bold text-dark-blue text-sm">
//           Roll the dice!
//         </p>
//       </div>
//     </div>
//   );
// }
