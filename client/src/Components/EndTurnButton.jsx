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
        cursor-pointer
        px-3 py-2
        lg:bottom-[12rem] bottom-29
        btn-green
        flex items-center justify-center gap-2"    
        onClick={async () => { await endTurn(code) }}>
            End Turn
        </button>
    );
}