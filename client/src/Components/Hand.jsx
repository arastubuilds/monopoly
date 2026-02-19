// // import { useGameStore } from "../store/gameStore";
// import { useGameStoreUsingSocket } from "../store/gameStoreUsingSocket";
// // import VoiceChat from "./VoiceChat";

// const Hand = ({ owned, money=0 }) => {
//     // console.log(owned);
//     // const {setIsViewing} = useGameStore();
//     const { setIsViewing } = useGameStoreUsingSocket();
//     return (
//         <div className="bg-white max-w-1/3 max-h-1/2 absolute left-0 border-4 border-red-600 rounded-xl p-4 md:shadow-2xl font-mono lg:top-15 top-10">
//             <h2 className="text-xl font-bold text-red-600 mb-1 text-center flex justify-center">
//                 Your Properties
//                 {/* <VoiceChat /> */}
//             </h2>
//             {/* <p className="text-sm text-gray-700 font-semibold mb-4 text-center">
//                 ${money?.toString()}
//             </p> */}
//             <div className="flex flex-wrap gap-3 overflow-y-auto scrollbar-thin scrollbar-thumb-red-500 scrollbar-track-red-100 justify-center">
//                 {owned.length === 0 ? (
//                     <p className="text-sm text-gray-500 text-center w-full">No properties yet</p>
//                 ) : (
//                     owned.map((property, index) => (
//                         <div
//                             key={index}
//                             className="bg-red-100 text-red-700 font-semibold text-sm rounded-md p-3 border border-red-300 flex flex-col items-center justify-between shadow-md"
//                         >
//                             <span className="text-center truncate w-full">
//                                 {property.name}
//                             </span>
//                             <button className="mt-2 bg-red-400 hover:bg-red-500 text-white text-xs py-1 px-3 rounded"
//                                 onClick={() => setIsViewing(property)}
//                             >
//                                 View
//                             </button>
//                         </div>
//                     ))
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Hand;
import boardData from "../lib/data";
import { useGameStoreUsingSocket } from "../store/gameStoreUsingSocket";

const Hand = ({ owned = [], money = 0 }) => {
  const { setIsViewing } = useGameStoreUsingSocket();

  return (
    <div
      className="
        absolute left-4 top-20 z-30
        
        max-h-[60vh]
        flex flex-col
        rounded-2xl
        bg-[#fdfaf4]
        border-2 border-[#d6cfc2]
        shadow-card
      "
    >
      {/* Header */}
      {/* <div
        className="
          px-4 py-3
          border-b-2 border-[#d6cfc2]
          flex items-center justify-between
        "
        style={{
          background:
            "linear-gradient(180deg, #f6f1e8 0%, #eee7db 100%)",
        }}
      >
        <h2 className="font-serif font-black text-dark-blue tracking-wide">
          Your Properties
        </h2>

        <span
          className="
            text-sm font-black
            px-3 py-1
            rounded-full
            bg-[#fff]
            border border-[#d6cfc2]
            text-dark-blue
          "
        >
          ${money || 15000}
        </span>
      </div> */}

      {/* Properties */}
      <div
        className="
          p-4
          flex-1
          overflow-y-auto
          grid grid-cols-3 gap-3
        "
      >
        {owned.length === 0 ? (
          <EmptyState />
        ) : (
          owned.sort().reverse().map((property, index) => (
            <PropertyCard
              key={index}
              property={property}
              onView={() => setIsViewing(property)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Hand;

function PropertyCard({ property, onView }) {
    return (
      <div
        className="
          relative
          rounded-lg
          bg-[#fffefb]
          border-2 border-[#e2dccf]
          shadow-piece
          p-2
          flex flex-col justify-between
        "
      >
        {/* Color strip (property group) */}
        <div
          className="absolute top-0 left-0 right-0 h-2 rounded-t-md"
          style={{ backgroundColor: `${boardData[property]?.color}` }}
        />
  
        <span className="mt-3 text-xs font-bold text-center truncate">
          {boardData[property].name}
        </span>
  
        <button
          className="
            mt-2
            rounded-md
            bg-[#f4efe6]
            border border-[#d6cfc2]
            text-[0.65rem]
            font-black
            uppercase
            tracking-widest
            py-1
            hover:bg-[#efe8db]
            transition
          "
          onClick={onView}
        >
          View
        </button>
      </div>
    );
  }

  function EmptyState() {
    return (
      <div className="col-span-2 flex items-center justify-center text-sm text-text-light italic">
        No properties yet
      </div>
    );
  }
  