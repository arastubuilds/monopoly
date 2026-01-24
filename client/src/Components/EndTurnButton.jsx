import { useGameStore } from "../store/gameStore";

export default function EndTurnButton() {
    const code = useGameStore.getState().code;
    const endTurn = useGameStore.getState().end;
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