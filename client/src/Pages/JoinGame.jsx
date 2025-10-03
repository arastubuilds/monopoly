import { useEffect, useState } from "react";
import { useGameStore } from "../store/gameStore";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

import { registerBasicEvents, unregisterBasicEvents } from "../lib/socket";
import { registerSignallingSocketEvents } from "../lib/voice-chat";
import Lobby from "./Lobby";
import Background from "../Components/Background";

const JoinGame = () => {

    const {socket, connectSocket} = useAuthStore();
    // const socket = useAuthStore((state) => state.socket);
    const navigate = useNavigate();

    useEffect(() => {
        if (socket) { registerBasicEvents(); 
            // registerSignallingSocketEvents(); 
        };

        return () => unregisterBasicEvents();
    }, [socket]);
    
    const { game, join, isJoining, joined } = useGameStore();
    const [code, setCode] = useState("");


    const handleChange = (e) => setCode(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        connectSocket();
        await join(code);
    }
    // if (game?.started) ( navigate(`/play/${game.code}`) )
    useEffect(() => {
        if (game?.started) 
            navigate(`/play/${game.code}`);
    }, [game])

    return (
        
        <div className="relative z-10 text-center h-screen flex flex-col justify-center items-center">
            <div className="bg-white shadow-lg rounded-2xl p-6 w-96 border-4 border-red-600">
                <h2 className="text-2xl font-bold text-center mb-4 font-mono text-red-600">
                    JOIN GAME
                </h2>
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <input
                        type="text"
                        placeholder="Code"
                        onChange={handleChange}
                        className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        
                    />
                    <button
                        type="submit"
                        disabled={isJoining || joined}
                        className="bg-red-600 text-white py-2 rounded-lg font-bold hover:bg-red-700 transition-all disabled:bg-gray-400"
                    >
                        { !joined ? (isJoining ? "Joining..." : "Join") : ("Joined")}
                    </button>
                </form>
                {joined && <Lobby />}
            </div>
        </div>
        
    )
}
export default JoinGame;