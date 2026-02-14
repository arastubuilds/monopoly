// import VoiceChat from "../Components/VoiceChat";
import { useEffect } from "react";
import { useGameStore } from "../store/gameStore";
// import { preloadSceneCanvas } from "../Components/SceneCanvasLazy";
import { preloadAllModels, preloadAllTextures } from "../utils/preload";
import { useGameStoreUsingSocket } from "../store/gameStoreUsingSocket";

const Lobby = () => {
    // const game = useGameStore((state) => state.game);
    // const isHost = useGameStore((state) => state.isHost);
    // const {start, isStarting} = useGameStore();
    const game = useGameStoreUsingSocket((state) => state.game);
    const isHost = useGameStoreUsingSocket((state) => state.isHost);
    const {start, isStarting} = useGameStoreUsingSocket();
    // console.log(isHost);
    
    const handleStart = async (e) => {
        // await start(game?.code);
        start(game?.code);
    }
    useEffect(() => {
        // preloadSceneCanvas();
        console.log("preloading...");
        preloadAllModels();
        preloadAllTextures();
    }, []);

    // return (
    // // <div className="relative z-10 text-center flex flex-col justify-center items-center">
    //     <div className="bg-gray-50 p-4 rounded-xl border-2 border-red-500 mt-4 mb-4">
    //         <h3 className="text-xl font-bold text-red-600 mb-3 font-mono text-center">
    //             LOBBY
    //         </h3>
    //         <div className="space-y-2">
    //             {game?.players?.map((player) => (
    //                 <div
    //                     key={player.userId}
    //                     className="bg-white shadow-sm rounded-md p-2 border border-gray-200 text-center text-gray-800 font-semibold"
    //                 >
    //                     {player?.userId}
    //                 </div>
    //             ))}
    //         </div>
    //         {/* <div className="mt-2">
    //             {/* <VoiceChat /> */}
    //         {/* </div>} */}
    //         {isHost &&  
    //             <button
    //                 onClick={handleStart}
    //                 className="text-center bg-red-600 text-white p-2 mt-2 rounded-lg font-bold hover:bg-red-700 transition-all disabled:bg-gray-400"
    //             >
    //                 {isStarting ? "Starting..." : "Start"}
    //             </button>
    //         }
    //     </div>
    // // </div>
    // );
    return (
        <div
          className="
            mt-4
            w-full
            bg-[#fffdf6]
            border-[3px] border-black/20
            rounded-2xl
            p-4
          "
        >
          {/* Header */}
          <h3
            className="
              font-display
              text-xl
              font-black
              tracking-wide
              text-monopoly-red
              text-center
              mb-3
            "
          >
            Lobby
          </h3>
    
          {/* Players */}
          <div
            className="
              space-y-2
              max-h-[30vh]
              overflow-y-auto
              pr-1
            "
          >
            {game?.players?.length === 0 ? (
              <div className="text-sm text-text-light text-center italic">
                Waiting for players…
              </div>
            ) : (
              game?.players?.map((player, idx) => (
                <div
                  key={player.userId ?? idx}
                  className="
                    flex items-center justify-center
                    px-3 py-2
                    rounded-xl
                    bg-white
                    border-[2px] border-black/10
                    
                    font-black
                    text-sm
                    tracking-wide
                  "
                >
                  {player.userId}
                </div>
              ))
            )}
          </div>
    
          {/* Host Action */}
          {isHost && (
            <button
              onClick={handleStart}
              disabled={isStarting}
              className="
                mt-4
                w-full
                btn-green
                py-3
                text-sm
                tracking-widest
                disabled:opacity-60
                disabled:translate-y-0
              "
            >
              {isStarting ? "Starting…" : "Start Game"}
            </button>
          )}
        </div>
      );
};

export default Lobby;
