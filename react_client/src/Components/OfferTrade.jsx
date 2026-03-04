import { useAuthStore } from "../store/authStore";
// import { useGameStore } from "../store/gameStore";
import { useState } from "react";
import { useGameStoreUsingSocket } from "../store/gameStoreUsingSocket";
import boardData from "../lib/data";


// const OfferTrade = ({ recipient }) => {
//     console.log(recipient);
//     const { authUser } = useAuthStore();
//     const { game, yourProperties, yourMoney, closeTrade, offerTrade } = useGameStoreUsingSocket();
//     const recipientProperties = recipient?.properties || [];
//     const recipientMoney = recipient?.player.money || 0;

//     const [own, setOwn] = useState([]);
//     const [other, setOther] = useState([]);

//     const [yourOffer, setYourOffer] = useState(0);
//     const [theirOffer, setTheirOffer] = useState(0);

//     const toggleProperty = (prop, isOwn) => {
//         if (isOwn) {
//             setOwn(prev =>
//                 prev.includes(prop) ? prev.filter(p => p !== prop) : [...prev, prop]
//             );
//         } else {
//             setOther(prev =>
//                 prev.includes(prop) ? prev.filter(p => p !== prop) : [...prev, prop]
//             );
//         }
//     };

//     const handleMoneyChange = (type, direction) => {
//         if (type === "you") {
//             setYourOffer(prev => {
//                 const next = direction === "inc" ? prev + 50 : Math.max(0, prev - 50);
//                 return next > yourMoney ? yourMoney : next;
//             });
//         } else {
//             setTheirOffer(prev => {
//                 const next = direction === "inc" ? prev + 50 : Math.max(0, prev - 50);
//                 return next > recipientMoney ? recipientMoney : next;
//             });
//         }
//     };

//     const handleOffer = () => {
//         const tradeOffer = {
//             sender: authUser,
//             senderOffer: {senderProp: own, senderMoney: yourOffer},
//             senderAsk: {askedProp: other, askedMoney: theirOffer},
//             recipient,
//         };
//         console.log(tradeOffer);
//         offerTrade(game?.code, recipient, tradeOffer);
//     };
//     return (
//         <div className="fixed inset-0 bg-black/40 z-50 flex flex-col items-center justify-center">
//             <div className="bg-white rounded-xl border-4 border-red-600 px-8 py-6 text-center font-mono w-[90%] max-w-5xl shadow-2xl flex flex-col gap-6 sm:flex-row justify-between">
                
//                 {/* Your Properties */}
//                 <div className="flex-1 border-4 border-red-600 rounded-lg p-4">
//                     <h2 className="text-2xl font-bold text-red-600 mb-2">Your Properties</h2>
//                     <p className="text-gray-800 mb-2">
//                         <span className="font-bold">${yourMoney}</span>
//                     </p>

//                     {/* Money Offer */}
//                     <div className="flex justify-center items-center gap-2 mb-4">
//                         <button
//                             onClick={() => handleMoneyChange("you", "dec")}
//                             className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
//                         >
//                             -
//                         </button>
//                         <span className="text-lg font-bold">${yourOffer}</span>
//                         <button
//                             onClick={() => handleMoneyChange("you", "inc")}
//                             className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
//                         >
//                             +
//                         </button>
//                     </div>

//                     {/* Property List */}
//                     {yourProperties.length ? (
//                         <div className="grid grid-cols-2 gap-2">
//                             {yourProperties.map((prop, index) => (
//                                 <label
//                                     key={index}
//                                     className="bg-red-100 border border-red-300 text-red-800 font-semibold rounded p-2 flex items-center gap-2 cursor-pointer"
//                                 >
//                                     <input
//                                         type="checkbox"
//                                         checked={own.includes(prop)}
//                                         onChange={() => toggleProperty(prop, true)}
//                                     />
//                                     {boardData[prop].name}
//                                 </label>
//                             ))}
//                         </div>
//                     ) : (
//                         <p className="text-gray-500">You own no properties</p>
//                     )}
//                 </div>

//                 {/* Recipient Properties */}
//                 <div className="flex-1 border-4 border-red-600 rounded-lg p-4">
//                     <h2 className="text-2xl font-bold text-red-600 mb-2">{recipient?.player.userName}'s Properties</h2>
//                     <p className="text-gray-800 mb-2">
//                         <span className="font-bold">${recipientMoney}</span>
//                     </p>

//                     {/* Money Offer */}
//                     <div className="flex justify-center items-center gap-2 mb-4">
//                         <button
//                             onClick={() => handleMoneyChange("them", "dec")}
//                             className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
//                         >
//                             -
//                         </button>
//                         <span className="text-lg font-bold">${theirOffer}</span>
//                         <button
//                             onClick={() => handleMoneyChange("them", "inc")}
//                             className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
//                         >
//                             +
//                         </button>
//                     </div>

//                     {/* Property List */}
//                     {recipientProperties.length ? (
//                         <div className="grid grid-cols-2 gap-2">
//                             {recipientProperties.map((prop, index) => (
//                                 <label
//                                     key={index}
//                                     className="bg-red-100 border border-red-300 text-red-800 font-semibold rounded p-2 flex items-center gap-2 cursor-pointer"
//                                 >
//                                     <input
//                                         type="checkbox"
//                                         checked={other.includes(prop)}
//                                         onChange={() => toggleProperty(prop, false)}
//                                     />
//                                     {prop.name}
//                                 </label>
//                             ))}
//                         </div>
//                     ) : (
//                         <p className="text-gray-500">No properties to display</p>
//                     )}
//                 </div>
//             </div>
//             <div className="flex justify-end gap-4 mt-6">
//                 <button
//                     className="bg-white border-4 border-red-600 text-red-600 font-bold py-2 px-6 rounded-lg hover:bg-red-600 hover:text-white transition-all"
//                     onClick={() => closeTrade()}
//                 >
//                     Close
//                 </button>
//                 <button
//                     className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 transition-all"
//                     onClick={handleOffer}
//                 >
//                     Offer Trade
//                 </button>
//             </div>  
//         </div>
//     );
// };

const OfferTrade = ({ recipient }) => {
    console.log(recipient);
    const { authUser } = useAuthStore();
    const { game, yourProperties, yourMoney, closeTrade, offerTrade } =
      useGameStoreUsingSocket();
  
    const recipientProperties = recipient?.properties || [];
    const recipientMoney = recipient?.player.money || 0;
  
    const [own, setOwn] = useState([]);
    const [other, setOther] = useState([]);
  
    const [yourOffer, setYourOffer] = useState(0);
    const [theirOffer, setTheirOffer] = useState(0);
  
    const toggleProperty = (prop, isOwn) => {
      if (isOwn) {
        setOwn((prev) =>
          prev.includes(prop) ? prev.filter((p) => p !== prop) : [...prev, prop]
        );
      } else {
        setOther((prev) =>
          prev.includes(prop) ? prev.filter((p) => p !== prop) : [...prev, prop]
        );
      }
    };
  
    const handleMoneyChange = (type, direction) => {
      if (type === "you") {
        setYourOffer((prev) => {
          const next = direction === "inc" ? prev + 50 : Math.max(0, prev - 50);
          return next > yourMoney ? yourMoney : next;
        });
      } else {
        setTheirOffer((prev) => {
          const next = direction === "inc" ? prev + 50 : Math.max(0, prev - 50);
          return next > recipientMoney ? recipientMoney : next;
        });
      }
    };
  
    const handleOffer = () => {
      const tradeOffer = {
        sender: authUser,
        senderOffer: { senderProp: own, senderMoney: yourOffer },
        senderAsk: { askedProp: other, askedMoney: theirOffer },
        recipient,
      };
  
      console.log(tradeOffer);
      offerTrade(game?.code, recipient, tradeOffer);
    };
  
    return (
      <div className="fixed inset-0 bg-black/40 z-50 flex flex-col items-center justify-center p-4">
        
        {/* MODAL */}
        <div
          className="
          bg-[#fdfaf4]
          rounded-2xl
          border-2 border-[#d6cfc2]
          px-6 py-6
          text-center
          w-full max-w-5xl
          shadow-card
          flex flex-row gap-6 justify-between
          max-h-[90vh]
        "
        >
  
          {/* YOUR PROPERTIES */}
          <div
            className="
            flex-1
            border-2 border-[#d6cfc2]
            rounded-xl
            p-4
            bg-[#f4f8ff]
            flex flex-col
          "
          >
            <h2 className="text-lg font-serif font-black text-[var(--monopoly-blue)] mb-2">
              Your Properties
            </h2>
  
            <p className="text-dark-blue mb-3 font-black">${yourMoney}</p>
  
            {/* Money Offer */}
            <div className="flex justify-center items-center gap-3 mb-4 bg-white border border-[#e2dccf] rounded-md py-2">
              <button
                onClick={() => handleMoneyChange("you", "dec")}
                className="bg-[#f4efe6] border border-[#d6cfc2] px-3 py-1 rounded-md font-black hover:bg-[#efe8db] transition"
              >
                -
              </button>
  
              <span className="text-lg font-black text-dark-blue">
                ${yourOffer}
              </span>
  
              <button
                onClick={() => handleMoneyChange("you", "inc")}
                className="bg-[#f4efe6] border border-[#d6cfc2] px-3 py-1 rounded-md font-black hover:bg-[#efe8db] transition"
              >
                +
              </button>
            </div>
  
            {/* PROPERTY LIST (SCROLLABLE) */}
            <div className="overflow-y-auto flex-1 pr-1">
              {yourProperties.length ? (
                <div className="grid grid-cols-2 gap-2">
                  {yourProperties.map((prop, index) => (
                    <label
                      key={index}
                      className="
                      relative
                      bg-[#fffefb]
                      border border-[#e2dccf]
                      text-dark-blue
                      font-semibold
                      rounded-md
                      px-2 py-1
                      flex items-center gap-2
                      shadow-piece
                      cursor-pointer
                    "
                    >
                      <div
                        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-md"
                        style={{ backgroundColor: boardData[prop].color }}
                      />
  
                      <input
                        type="checkbox"
                        checked={own.includes(prop)}
                        onChange={() => toggleProperty(prop, true)}
                      />
  
                      {boardData[prop].name}
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-text-light italic">You own no properties</p>
              )}
            </div>
          </div>
  
  
          {/* RECIPIENT PROPERTIES */}
          <div
            className="
            flex-1
            border-2 border-[#d6cfc2]
            rounded-xl
            p-4
            bg-[#fff4f4]
            flex flex-col
          "
          >
            <h2 className="text-lg font-serif font-black text-[var(--monopoly-red)] mb-2">
              {recipient?.player.userName}'s Properties
            </h2>
  
            <p className="text-dark-blue mb-3 font-black">${recipientMoney}</p>
  
            {/* Money Offer */}
            <div className="flex justify-center items-center gap-3 mb-4 bg-white border border-[#e2dccf] rounded-md py-2">
              <button
                onClick={() => handleMoneyChange("them", "dec")}
                className="bg-[#f4efe6] border border-[#d6cfc2] px-3 py-1 rounded-md font-black hover:bg-[#efe8db] transition"
              >
                -
              </button>
  
              <span className="text-lg font-black text-dark-blue">
                ${theirOffer}
              </span>
  
              <button
                onClick={() => handleMoneyChange("them", "inc")}
                className="bg-[#f4efe6] border border-[#d6cfc2] px-3 py-1 rounded-md font-black hover:bg-[#efe8db] transition"
              >
                +
              </button>
            </div>
  
            {/* PROPERTY LIST (SCROLLABLE) */}
            <div className="overflow-y-auto flex-1 pr-1">
              {recipientProperties.length ? (
                <div className="grid grid-cols-2 gap-2">
                  {recipientProperties.map((prop, index) => (
                    <label
                      key={index}
                      className="
                      relative
                      bg-[#fffefb]
                      border border-[#e2dccf]
                      text-dark-blue
                      font-semibold
                      rounded-md
                      px-2 py-1
                      flex items-center gap-2
                      shadow-piece
                      cursor-pointer
                    "
                    >
                      <div
                        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-md"
                        style={{ backgroundColor: prop.color }}
                      />
  
                      <input
                        type="checkbox"
                        checked={other.includes(prop)}
                        onChange={() => toggleProperty(prop, false)}
                      />
  
                      {prop.name}
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-text-light italic">
                  No properties to display
                </p>
              )}
            </div>
          </div>
        </div>
  
        {/* BUTTONS */}
        <div className="flex justify-end gap-4 mt-2">
          <button
            className="btn-red px-4 py-2"
            onClick={() => closeTrade()}
          >
            Close
          </button>
  
          <button
            className="btn-blue px-4 py-2"
            onClick={handleOffer}
          >
            Offer Trade
          </button>
        </div>
  
      </div>
    );
  };
  
export default OfferTrade;
