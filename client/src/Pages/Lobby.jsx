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
        await start(game?.code);
    
    }
    useEffect(() => {
        // preloadSceneCanvas();
        console.log("preloading...");
        preloadAllModels();
        preloadAllTextures();
    }, []);

    return (
    // <div className="relative z-10 text-center flex flex-col justify-center items-center">
        <div className="bg-gray-50 p-4 rounded-xl border-2 border-red-500 mt-4 mb-4">
            <h3 className="text-xl font-bold text-red-600 mb-3 font-mono text-center">
                LOBBY
            </h3>
            <div className="space-y-2">
                {game?.players?.map((player) => (
                    <div
                        key={player.userId}
                        className="bg-white shadow-sm rounded-md p-2 border border-gray-200 text-center text-gray-800 font-semibold"
                    >
                        {player?.userId}
                    </div>
                ))}
            </div>
            {/* <div className="mt-2">
                {/* <VoiceChat /> */}
            {/* </div>} */}
            {isHost &&  
                <button
                    onClick={handleStart}
                    className="text-center bg-red-600 text-white p-2 mt-2 rounded-lg font-bold hover:bg-red-700 transition-all disabled:bg-gray-400"
                >
                    {isStarting ? "Starting..." : "Start"}
                </button>
            }
        </div>
    // </div>
    );
};

export default Lobby;
