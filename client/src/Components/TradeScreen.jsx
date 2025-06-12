import { useGameStore } from "../store/gameStore";

const TradeScreen = (receipient) => {
    const { yourProperties } = useGameStore();
    console.log(yourProperties, receipient);

    return (
        <>
        </>
    )
}
export default TradeScreen;