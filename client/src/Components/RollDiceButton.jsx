import { useGameStore } from "../store/gameStore";
import { useDiceStore } from "../store/useDiceStore";
import { useTokenStore } from "../store/useTokenStore";

const RollDiceButton = () => {
    // const rollDice =  useDiceStore((state) => state.rollDice);
    const rollDice = useGameStore((state) => state.roll);
    const code = useGameStore((state) => state.code);
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
        onClick={async () => { await rollDice(code);  }}>
            Roll Dice
        </button>
    );
};
export default RollDiceButton;