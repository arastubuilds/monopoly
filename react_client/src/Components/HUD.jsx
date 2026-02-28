// // import { useGameStore } from "../store/gameStore";
// import { useGameStoreUsingSocket } from "../store/gameStoreUsingSocket";
// // import VoiceChat from "./VoiceChat";

// export default function HUD () {

//     const yourMoney = useGameStoreUsingSocket((state) => state.yourMoney);
    
//     const setIsViewingOwnProps = useGameStoreUsingSocket.getState().setIsViewingOwnProps;
//     const isViewingOthersProps = useGameStoreUsingSocket((state) => state.isViewingOthersProps);
//     const isViewingOwnProps = useGameStoreUsingSocket((state) => state.isViewingOwnProps);
//     const setIsViewingOthersProps = useGameStoreUsingSocket.getState().setIsViewingOthersProps;
//     // const yourMoney = useGameStore((state) => state.yourMoney);
    
//     // const setIsViewingOwnProps = useGameStore.getState().setIsViewingOwnProps;
//     // const isViewingOthersProps = useGameStore((state) => state.isViewingOthersProps);
//     // const isViewingOwnProps = useGameStore((state) => state.isViewingOwnProps);
//     // const setIsViewingOthersProps = useGameStore.getState().setIsViewingOthersProps;

//     return (
//         <div className="h-[8%] w-[99%] flex justify-between absolute top-1.5">
//             <div className="bg-black/20 w-1/5 h-full border-none rounded-full flex items-center justify-center">
//                 <div className="w-[95%] h-3/4 flex items-center justify-evenly bg-white/80 border rounded-full">
                    
//                     <span className="w-1/2 text-center lg:text-lg text-xs truncate">Arastu Vij</span>
//                     <span className="w-1/3 text-center lg:text-lg text-xs">${yourMoney || 15000}</span>
//                     <button className="w-1/3 z-100 text-center lg:text-lg text-xs hover:text-red" 
//                         onClick={() => {
//                                 setIsViewingOwnProps(!isViewingOwnProps)
//                             }
//                         }
//                     >
//                         {isViewingOwnProps ? "Close" : "View"}
//                     </button>
//                     {/* <div className="w-1/3 flex justify-center lg:text-lg text-xs"><VoiceChat /></div> */}

//                 </div>
//             </div>
//             <div className="bg-black/20 w-1/5 h-full border-none rounded-full flex items-center justify-center">
//                     <div className="w-[95%] h-3/4 flex items-center justify-evenly bg-white/80 border rounded-full">
//                     <span className="w-1/2 text-center lg:text-lg text-xs truncate">Others</span>
//                     {/* <span className="w-1/3 text-center lg:text-lg text-xs">${yourMoney || 15000}</span> */}
//                     <button className="w-1/3 z-100 text-center lg:text-lg text-xs hover:text-red" 
//                         onClick={() => {
//                                 setIsViewingOthersProps(!isViewingOthersProps)
//                             }
//                         }
//                     >
//                         {isViewingOthersProps ? "Close" : "View"}
//                     </button>
//                     {/* <div className="w-1/3 flex justify-center lg:text-lg text-xs"><VoiceChat /></div> */}

//                 </div>
//             </div>
//         </div>
//     )
// }
import { useGameStoreUsingSocket } from "../store/gameStoreUsingSocket";

export default function HUD() {
  const yourMoney = useGameStoreUsingSocket((state) => state.yourMoney);

  const setIsViewingOwnProps = useGameStoreUsingSocket.getState().setIsViewingOwnProps;
  const setIsViewingOthersProps = useGameStoreUsingSocket.getState().setIsViewingOthersProps;

  const isViewingOwnProps = useGameStoreUsingSocket(
    (state) => state.isViewingOwnProps
  );
  const isViewingOthersProps = useGameStoreUsingSocket(
    (state) => state.isViewingOthersProps
  );

  return (
    <div className="w-full pointer-events-none absolute top-4 left-0 right-0 z-40 flex justify-center">
      <div className="pointer-events-auto flex  px-0 w-full justify-evenly">
        {/* YOUR PANEL */}
        <HudPill>
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full text-white flex items-center justify-center font-black text-sm shadow-piece" style={{ backgroundColor: "var(--monopoly-blue)" }}>
              AV
            </div>

            {/* Name + Money */}
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-bold text-text-light">
                You
              </span>
              <span className="text-sm font-black text-dark-blue">
                ${yourMoney || 15000}
              </span>
            </div>
          </div>

          <button
            className="hud-action"
            onClick={() => setIsViewingOwnProps(!isViewingOwnProps)}
          >
            {isViewingOwnProps ? "Close" : "View"}
          </button>
        </HudPill>
        <div className="w-1/2"/>
        {/* OTHERS PANEL */}
        <HudPill>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full text-white flex items-center justify-center font-black text-sm shadow-piece" style={{ backgroundColor: "var(--monopoly-red)" }}>
              O
            </div>

            <span className="text-sm font-bold text-dark-blue">
              Others
            </span>
          </div>

          <button
            className="hud-action"
            onClick={() =>
              setIsViewingOthersProps(!isViewingOthersProps)
            }
          >
            {isViewingOthersProps ? "Close" : "View"}
          </button>
        </HudPill>
      </div>
    </div>
  );
}
function HudPill({ children }) {
    return (
      <div
        className={`
          
          lg:w-1/6
          glass-panel
          flex justify-between items-center gap-4
          px-4 py-2
          rounded-full
          shadow-card
        `}
      >
        {children}
      </div>
    );
  }
  