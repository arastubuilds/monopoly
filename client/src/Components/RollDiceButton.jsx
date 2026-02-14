import { useGameStore } from "../store/gameStore";
import { useGameStoreUsingSocket } from "../store/gameStoreUsingSocket";
import { useDiceStore } from "../store/useDiceStore";
import { useTokenStore } from "../store/useTokenStore";

const RollDiceButton = () => {
    // const rollDice =  useDiceStore((state) => state.rollDice);
    // const rollDice = useGameStore((state) => state.roll);
    // const code = useGameStore((state) => state.code);
    const rollDice = useGameStoreUsingSocket((state) => state.roll);
    const isRolling = useGameStoreUsingSocket((state) => state.isRolling);
    const code = useGameStoreUsingSocket((state) => state.code);
    // console.log(code);

    // btn-green px-6 py-3 text-[clamp(0.9rem,1.2vw,1.1rem)] flex items-center justify-center gap-2
    // border-none rounded-full
    // cursor-pointer
    // transition-colors duration-200
    // hover:bg-black/20
    return (
        <button
        className="
        absolute
        cursor-pointer
        px-3 py-2
        lg:bottom-[15rem] bottom-29
        btn-green
        flex items-center justify-center gap-2
        "    
        onClick={() => {  rollDice(code);  }}>
            {isRolling ? "Rolling" : "Roll Dice"}
        </button>
    );
};
export default RollDiceButton;