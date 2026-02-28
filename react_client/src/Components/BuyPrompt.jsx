import { useState } from "react";
import { useGameStore } from "../store/gameStore";
import { useGameStoreUsingSocket } from "../store/gameStoreUsingSocket";
import boardData from "../lib/data";

const PropCard = ({ id }) => {
    const [buying, setBuying] = useState(false);
    const [passing, setPassing] = useState(false);
    // const { game, buy, pass } = useGameStore();
    const { game, buy, pass } = useGameStoreUsingSocket();
    const handleBuy =  () =>  { setBuying(true);  buy(game?.code); setBuying(false); };
    const handlePass = () => { setPassing(true); pass(); setPassing(false); };

    const space = boardData[id];
  
    return (
      <div className="fixed inset-0 z-50 bg-black/40 flex flex-col items-center justify-center px-4 lg:-top-10">
        <div
          className="
            rounded-2xl
            relative
            bg-[#fffdf6]
            shadow-card
            overflow-hidden
            font-serif
          "
        >
          {/* Color Strip */}
          <div
            className="h-14 flex items-center justify-center"
            style={{ backgroundColor: `${space.color}` }}
          >
            <span className="text-white font-black tracking-widest uppercase text-sm">
              {/* Property Deed */}
            </span>
          </div>
  
          {/* Card Body */}
          <div className="p-6 text-center">
            {/* Property Name */}
            <h2 className="font-display text-2xl font-black text-dark-blue mb-4">
              {space?.name}
            </h2>
  
            {/* Price */}
            <div className="mb-4">
              {/* <span className="text-xs uppercase tracking-widest text-text-light">
                Purchase Price
              </span> */}
              <div className="mt-1 font-black text-lg">
                ${space?.base}
              </div>
            </div>
  
            {/* Divider */}
            <div className="h-px bg-black/10 my-4" />
  
            {/* Rent Table */}
            <div className="space-y-2 text-sm">
              {/* <RentRow label="Base Rent" value={space?.base} /> */}
              
              {space?.rent1 && <RentRow label="With 1 House:" value={space.rent1} />}
              {space?.rent2 && <RentRow label="With 2 Houses:" value={space.rent2} />}
              {space?.rent3 && <RentRow label="With 3 Houses:" value={space.rent3} />}
              {space?.rent4 && <RentRow label="With 4 Houses:" value={space.rent4} />}
              {space?.rent5 && <RentRow label="With Hotel" value={space.rent5} />}
            </div>
                  
            <div className="h-px bg-black/10 my-4" />
  
          <div className="space-y-2 text-sm">
              Each House and Hotel costs ${space.hcost}
           </div>
                    {/* Buy & Pass Button */}
        <div className="w-full flex justify-between mt-6">
                <button
                    onClick={handleBuy}
                    className="
                        w-1/2
                        mr-1
                        py-2
                        px-2
                        btn-red
                        cursor-pointer
                        rounded-xl
                        font-black
                        uppercase
                        tracking-widest
                        text-sm
                        transition
                    "
                    >
                    Buy
                </button>
                <button
                    onClick={handlePass}
                    className="
                        w-1/2
                        ml-1
                        py-3
                        px-2
                        btn-blue
                        cursor-pointer
                        rounded-xl
                        font-black
                        uppercase
                        tracking-widest
                        text-sm
                        transition
                    "
                    >
                    Pass
                </button>
        </div>

          </div>
  
          {/* Paper Grain */}
          <div
            className="
              pointer-events-none
              absolute inset-0
              bg-[radial-gradient(circle_at_30%_30%,rgba(0,0,0,0.04),transparent_70%)]
            "
          />
        </div>
      </div>
    );
  };
  
  
/* ---------- Helpers ---------- */

function RentRow({ label, value }) {
return (
    <div className="flex justify-between items-center px-2">
    <span className="font-bold text-text-light">{label}</span>
    <span className="font-black">${value}</span>
    </div>
);
}
const BuyPrompt = ({ space  }) => {
    const [buying, setBuying] = useState(false);
    const [passing, setPassing] = useState(false);
    // const { game, buy, pass } = useGameStore();
    // console.log(space.id);
    
    const { game, buy, pass } = useGameStoreUsingSocket();
    const handleBuy =  () =>  { setBuying(true);  buy(game?.code); setBuying(false); };
    const handlePass = () => { setPassing(true); pass(); setPassing(false); };
    
    if (!space) return null;

    return (
        // <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
        //     <div className="bg-white rounded-xl border-4 border-red-600 px-8 py-6 text-center font-mono w-[90%] max-w-md shadow-2xl">
                
        //         <h2 className="text-3xl font-bold text-red-600 mb-2">
        //             {space.name}
        //         </h2>
                
        //         {space.price ? (
        //             <>
        //                 <p className="text-lg text-gray-800 mb-6">
        //                     Would you like to purchase this property for
        //                     <span className="font-bold"> ${space.price}</span>?
        //                 </p>

        //                 <div className="flex flex-col sm:flex-row justify-center gap-4">
        //                     <button
        //                         className="w-full sm:w-32 h-12 bg-red-600 text-white rounded-lg font-bold text-lg hover:bg-red-700 transition-all"
        //                         onClick={handleBuy}
        //                     >
        //                         {buying ? "Buying..." : "Buy"}
        //                     </button>
        //                     <button
        //                         className="w-full sm:w-32 h-12 bg-white text-red-600 border-4 border-red-600 rounded-lg font-bold text-lg hover:bg-red-600 hover:text-white transition-all"
        //                         onClick={handlePass}
        //                     >
        //                         {passing ? "Passing..." : "Pass"}
        //                     </button>
        //                 </div>
        //             </>
        //         ) : (
        //             <div className="flex flex-col sm:flex-row justify-center gap-4">
        //                 <p className="text-gray-600">This space cannot be purchased.</p>
        //                     <button
        //                     className="w-full sm:w-32 h-12 bg-white text-red-600 border-4 border-red-600 rounded-lg font-bold text-lg hover:bg-red-600 hover:text-white transition-all"
        //                     onClick={handlePass}
        //                     >
        //                 {passing ? "Passing..." : "Pass"}
        //                 </button>
        //             </div>
        //         )}
        //     </div>
        // </div>
        <PropCard id={space.id}/>
    );
};

export default BuyPrompt;
