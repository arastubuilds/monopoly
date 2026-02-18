// import { useGameStore } from "../store/gameStore";

// const RightHand = ({ players }) => {
//     // console.log(players);
//     const { setIsOffering, setTradingWith } = useGameStore();
//     return (
//         <div className="bg-white max-w-1/3 max-h-1/2 absolute lg:right-6 right-0 border-4 border-red-600 rounded-xl p-4 md:shadow-2xl font-mono lg:top-15 top-10">
//             <h2 className="text-xl font-bold text-red-600 mb-4 text-center">
//                 Player Properties
//             </h2>
//             {players?.length === 0 ? (
//                 <p className="text-sm text-gray-500 text-center">No players yet</p>
//             ) : (
//                 players?.map(({ player, properties }, index) => (
//                     <div key={index} className="mb-6">
//                         <div className="flex justify-between items-center mb-2">
//                             <h3 className="text-md font-bold text-red-700 underline">
//                                 {player?.userId?.username || "Unnamed Player"}
//                             </h3>
//                             <p className="text-sm text-gray-700 font-semibold">
//                                 ${player?.money?.toString() || 0}
//                             </p>
//                             <button
//                                 className="ml-2 px-2 py-1 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition-all text-xs"
//                                 onClick={() => {setIsOffering(true); setTradingWith({player, properties})} }
//                             >
//                                 Trade
//                             </button>
//                         </div>
//                         {properties.length === 0 ? (
//                             <p className="text-sm text-gray-500 text-center">No properties</p>
//                         ) : (
//                             <div className="space-y-2">
//                                 {properties.map((property, i) => (
//                                     <div
//                                         key={i}
//                                         className="flex justify-between items-center bg-red-100 text-red-700 font-semibold text-sm rounded-md px-2 py-1 border border-red-300"
//                                     >
//                                         <span>{property.name}</span>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 ))
//             )}
//         </div>
//     );
// };

// export default RightHand;
// import { useGameStore } from "../store/gameStore";
import { useGameStoreUsingSocket } from "../store/gameStoreUsingSocket";

const RightHand = ({ players = [] }) => {
  const { setIsOffering, setTradingWith } = useGameStoreUsingSocket();

  return (
    <div
      className="
        absolute right-4 top-20 z-30
        w-[clamp(16rem,22vw,22rem)]
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
          Player Properties
        </h2>
      </div> */}

      {/* Content */}
      <div className="p-4 flex-1 overflow-y-auto">
        {players.length === 0 ? (
          <EmptyState text="No players yet" />
        ) : (
          players.map(({ player, properties }, index) => (
            <PlayerSection
              key={index}
              player={player}
              properties={properties}
              onTrade={() => {
                setIsOffering(true);
                setTradingWith({ player, properties });
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default RightHand;

function PlayerSection({ player, properties = [], onTrade }) {
    const {setIsViewing} = useGameStoreUsingSocket();
    return (
      <div className="space-y-2">
        {/* Player header */}
        <div
          className="
            flex items-center justify-between
            rounded-lg
            bg-[#fffefb]
            border-2 border-[#e2dccf]
            px-3 py-2
          "
        >
          <div className="flex flex-col">
            <span className="text-xs font-bold text-text-light uppercase tracking-wide">
              Player
            </span>
            <span className="text-sm font-black text-dark-blue truncate max-w-[10rem]">
              {player?.userName || "Unnamed Player"}
            </span>
          </div>
  
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-dark-blue">
              ${player?.money ?? 0}
            </span>
  
            <button
              className="
                rounded-md
                bg-[#f4efe6]
                border border-[#d6cfc2]
                px-2 py-1
                text-[0.65rem]
                font-black
                uppercase
                tracking-widest
                hover:bg-[#efe8db]
                transition
              "
              onClick={onTrade}
            >
              Trade
            </button>
          </div>
        </div>
  
        {/* Properties */}
        {properties.length === 0 ? (
          <EmptyState text="No properties" />
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {properties.map((property, i) => (
              <OtherPropertyCard key={i} name={property.name} onView={() => setIsViewing(property.id)}/>
            ))}
          </div>
        )}
      </div>
    );
  }

  function OtherPropertyCard({ name, onView }) {
    return (
      <div
        className="
          rounded-md
          bg-[#fffefb]
          border border-[#e2dccf]
          px-2 py-1
          text-xs
          font-semibold
          text-dark-blue
          shadow-piece
          flex items-center justify-between
        "
        title={name}
      >
        <span className="truncate">{name}</span>
        <button
          className="
            
            rounded-md
            bg-[#f4efe6]
            border border-[#d6cfc2]
            text-[0.65rem]
            font-black
            uppercase
            tracking-widest
            py-1 px-1
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

  function EmptyState({ text }) {
    return (
      <div className="text-sm text-text-light italic text-center py-2">
        {text}
      </div>
    );
  }
  