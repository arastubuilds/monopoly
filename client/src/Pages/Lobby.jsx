import VoiceChat from "../Components/VoiceChat";
import { useGameStore } from "../store/gameStore";

const Lobby = () => {
    const game = useGameStore((state) => state.game);

    return (
    // <div className="relative z-10 text-center flex flex-col justify-center items-center">
        <div className="bg-gray-50 p-4 rounded-xl border-2 border-red-500 mt-4 mb-4">
            <h3 className="text-xl font-bold text-red-600 mb-3 font-mono text-center">
                LOBBY
            </h3>
            <div className="space-y-2">
                {game?.players?.map((player) => (
                    <div
                        key={player.userId.username}
                        className="bg-white shadow-sm rounded-md p-2 border border-gray-200 text-center text-gray-800 font-semibold"
                    >
                        {player?.userId.username}
                    </div>
                ))}
            </div>
            <div className="mt-2">
                <VoiceChat />
            </div>
        </div>
    // </div>
    );
};

export default Lobby;
