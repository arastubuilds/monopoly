import { useEffect, useState } from "react";
// import { useGameStore } from "../store/gameStore";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

import { registerBasicEvents, unregisterBasicEvents } from "../lib/socket";
import { registerSignallingSocketEvents } from "../lib/voice-chat";
import Lobby from "./Lobby";
import Background from "../Components/Background";
import { useGameStoreUsingSocket } from "../store/gameStoreUsingSocket";

const JoinGame = () => {

    const {socket, connectSocket} = useAuthStore();
    // const socket = useAuthStore((state) => state.socket);
    const navigate = useNavigate();

    useEffect(() => {
        if (socket) { registerBasicEvents(); 
            // registerSignallingSocketEvents(); 
            // join(code);
        };

        return () => unregisterBasicEvents();
    }, [socket]);
    
    // const { game, join, isJoining, joined } = useGameStore();
    const { game, join, isJoining, joined } = useGameStoreUsingSocket();
    const [code, setCode] = useState("");


    const handleChange = (e) => setCode(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        connectSocket();
        join(code);
        // await join(code);
    }
    // if (game?.started) ( navigate(`/play/${game.code}`) )
    useEffect(() => {
        if (game?.started) 
            navigate(`/play/${game.code}`);
    }, [game])

    // return (
        
    //     <div className="relative z-10 text-center h-screen flex flex-col justify-center items-center">
    //         <div className="bg-white shadow-lg rounded-2xl p-6 w-96 border-4 border-red-600">
    //             <h2 className="text-2xl font-bold text-center mb-4 font-mono text-red-600">
    //                 JOIN GAME
    //             </h2>
    //             <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
    //                 <input
    //                     type="text"
    //                     placeholder="Code"
    //                     onChange={handleChange}
    //                     className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        
    //                 />
    //                 <button
    //                     type="submit"
    //                     disabled={isJoining || joined}
    //                     className="bg-red-600 text-white py-2 rounded-lg font-bold hover:bg-red-700 transition-all disabled:bg-gray-400"
    //                 >
    //                     { !joined ? (isJoining ? "Joining..." : "Join") : ("Joined")}
    //                 </button>
    //             </form>
    //             {joined && <Lobby />}
    //         </div>
    //     </div>
        
    // )
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
              text-center
      
              
              p-6
      
              
              landscape-sm:scale-[0.9]
              landscape-sm:p-4
            "
          >
            {/* Title */}
            <h2
              className="
                font-display
                font-black
                tracking-wide
                text-monopoly-red
                mb-3
      
                text-3xl
                landscape-sm:text-2xl
              "
            >
              Join Game
            </h2>
      
            {/* Subtitle */}
            <p
              className="
                text-text-light
                mb-5
                text-sm
                landscape-sm:text-xs
                landscape-sm:mb-4
              "
            >
              Enter your room code
            </p>
      
            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="
                flex flex-col gap-4
                landscape-sm:gap-3
              "
            >
              <input
                type="text"
                placeholder="GAME CODE"
                onChange={handleChange}
                disabled={joined}
                className="
                  w-full
                  text-center
                  uppercase
                  tracking-widest
                  font-black
      
                  text-lg
                  landscape-sm:text-base
      
                  px-4 py-3
                  landscape-sm:py-2.5
      
                  rounded-2xl
                  bg-white
                  border-[3px] border-black/20
                  shadow-piece
      
                  focus:outline-none
                  focus:border-monopoly-blue
                "
              />
      
              <button
                type="submit"
                disabled={isJoining || joined}
                className="
                  btn-green
                  py-3
                  text-sm
                  tracking-widest
      
                  landscape-sm:py-2.5
                  landscape-sm:text-xs
      
                  disabled:opacity-60
                  disabled:translate-y-0
                "
              >
                {!joined ? (isJoining ? "Joining..." : "Join Game") : "Joined"}
              </button>
            </form>
      
            {/* Lobby */}
            {joined && (
              <div className="mt-5 landscape-sm:mt-4">
                <Lobby />
              </div>
            )}
          </div>
        </div>
      );
      
      
}
export default JoinGame;