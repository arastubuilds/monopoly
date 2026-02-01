import { useGameStore } from "../store/gameStore";
import { useGameStoreUsingSocket } from "../store/gameStoreUsingSocket";

export default function EndTurnButton() {
    // const code = useGameStore.getState().code;
    // const endTurn = useGameStore.getState().end;
    const code = useGameStoreUsingSocket.getState().code;
    const endTurn = useGameStoreUsingSocket.getState().end;
    return (
        <button
        className="
        absolute
        h-[5%] w-[8%]
        lg:bottom-52 bottom-30
        bg-black/10
        border-none rounded-full
        cursor-pointer
        transition-colors duration-200
        hover:bg-black/20"    
        onClick={async () => { await endTurn(code) }}>
            End Turn
        </button>
    );
}