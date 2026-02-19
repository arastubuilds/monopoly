import { useEffect, useState } from "react";
import { useGameStore } from "../store/gameStore";
import { Loader, Clipboard } from "lucide-react";
import Lobby from "./Lobby";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { registerBasicEvents, unregisterBasicEvents } from "../lib/socket";
import { registerSignallingSocketEvents } from "../lib/voice-chat";
import { useGameStoreUsingSocket } from "../store/gameStoreUsingSocket";


const CreateGame = () => {
    // const { create, game, start, isStarting } = useGameStore();
    const {create, game, start, isStarting} = useGameStoreUsingSocket();
    // const socket = useAuthStore((state) => state.socket);
    const {socket, connectSocket} = useAuthStore();

    const [initialLoading, setInitialLoading] = useState(true);
    const navigate = useNavigate();

    const handleStart = async (e) => {
        await start(game?.code);
    
    }
    useEffect(() => {
        
        if (socket) { registerBasicEvents(); 
            // create(socket);
            // registerSignallingSocketEvents(); 
            create(socket);
            setInitialLoading(false);
        };

        return () => unregisterBasicEvents();
    }, [socket]);

    useEffect(() => {
        connectSocket();
        // const createGame = async () => {
        //     await create();
        //     setInitialLoading(false);
        // };
        // createGame();
        
    }, []);
    // if (game?.started) ( navigate(`/play/${game.code}`) )
    useEffect(() => {
        if (game?.started) 
            navigate(`/play/${game.code}`);
    }, [game])

    if (initialLoading){
        // console.log(isCreating);
        
        return (
            <div className="relative z-20 flex justify-center items-center h-screen">
                <Loader className="animate-spin w-12 h-12 text-red-600" />
            </div>
        );
    }
    // return (
    
    //     <div className="relative z-10 text-center h-screen flex flex-col justify-center items-center">
    //         <div className="bg-white shadow-lg rounded-2xl p-6 w-96 border-4 border-red-600 mx-auto mt-10 flex flex-col">
    //             <h2 className="text-2xl font-bold text-center mb-4 font-mono text-red-600">
    //                 GAME CREATED
    //             </h2>
    //             <div className="text-center text-lg mb-6">
    //                 <span className="font-semibold">Code:</span>{" "}
    //                 <span className="font-mono text-red-500">{game?.code}</span>
    //             </div>
    //             {isStarting ? <div className="flex justify-center items-center mb-4"><Loader className="animate-spin w-8 h-8 text-red-600" /></div> : <Lobby />}
    //             {/* <button
    //                 onClick={handleStart}
    //                 className="text-center bg-red-600 text-white py-2 rounded-lg font-bold hover:bg-red-700 transition-all disabled:bg-gray-400"
    //             >
    //                 {isStarting ? "Starting..." : "Start"}
    //             </button> */}
    //         </div>
    //     </div>

    // );
    return (
        <div
          className="
            relative z-10
            h-[100svh]
            flex items-center justify-center
            px-4
            overflow-hidden
          "
        >
          <div
            className="
              w-full max-w-sm
              bg-[#fffdf6]
              border-[3px] border-monopoly-red
              rounded-3xl
              shadow-card
              p-6
              text-center
            "
          >
            {/* Title */}
            <h2
              className="
                font-display
                text-3xl
                font-black
                text-monopoly-red
                tracking-wide
                mb-3
              "
            >
              Game Created
            </h2>
    
            {/* Subtitle */}
            <p className="text-sm text-text-light mb-4">
              Share this code with your friends
            </p>
    
{/* Game Code */}
<div className="mb-5 flex items-center justify-center gap-3">
  <div
    className="
      px-4 py-3
      rounded-2xl
      bg-white
      border-[3px] border-black/20
      shadow-piece
      font-black
      text-lg
      tracking-widest
      uppercase
      text-monopoly-red
    "
  >
    {game?.code}
  </div>

  <button
    onClick={() => navigator.clipboard.writeText(game?.code)}
    className="
      w-11 h-11
      flex items-center justify-center
      btn-green
    "
    aria-label="Copy game code"
  >
    <Clipboard />
  </button>
</div>

    
            {/* Loader or Lobby */}
            <div className="mt-4">
              {isStarting ? (
                <div className="flex justify-center items-center py-4">
                  <Loader className="w-8 h-8 text-monopoly-red animate-spin" />
                </div>
              ) : (
                <Lobby />
              )}
            </div>
          </div>
        </div>
      );
};

export default CreateGame;
