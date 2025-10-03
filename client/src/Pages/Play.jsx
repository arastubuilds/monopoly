import { useEffect } from "react";
import { MonopolyBoard } from "../Components/Board";
import { useGameStore } from "../store/gameStore";

import { registerPlayerEvents, unregisterPlayerEvents } from "../lib/socket";
import BuyPrompt from "../Components/BuyPrompt";
import Hand from "../Components/Hand";
import RightHand from "../Components/RightHand";
import PayRentPrompt from "../Components/PayRentPrompt";
import YourOwnPrompt from "../Components/YourOwnPrompt";
import OfferTrade from "../Components/OfferTrade";
import OwnedProp from "../Components/OwnedProp";
import OfferedTrade from "../Components/OfferedTrade";

const Play = () => {
    const game = useGameStore((state) => state.game);
    const yourMoney = useGameStore((state) => state.yourMoney);
    const landedOn = useGameStore((state) => state.landedOn);
    const yourProperties = useGameStore((state) => state.yourProperties);
    const oPP = useGameStore((state) => state.oPP);
    const { roll, end, rolled, passed, viewing, tradingWith, offeredTrade, isYourTurn, isBuying, isPaying, isOwn, isViewing, isOffering, isOffered } = useGameStore();
    // console.log(tradingWith);
    // console.log(yourMoney);
    // console.log(isOffered, offeredTrade);
    
    useEffect(() => {
        registerPlayerEvents();
        return () => unregisterPlayerEvents();
    }, []);

    const handleClick = async() => {
        await roll(game?.code);
    }
    const handleEnd = async() => {
        await end(game?.code);
    }

    return (
        <div className="w-screen h-screen flex flex-col md:flex-row justify-between gap-5">
            {/* Left Hand (Top on small screens) */}
            <div className="w-full md:w-[23%] flex justify-center items-start p-2">
                <Hand owned={yourProperties} money={yourMoney} />
            </div>
    
            {/* Board (Middle) */}
            <div className="w-full md:w-[50%] flex justify-center items-center relative md:h-screen">
                <MonopolyBoard boardData={game?.boardState}>
                    {!rolled &&  (
                        <button
                            className="z-30 border cursor-pointer text-[8px]"
                            style={{ gridColumn: "7", gridRow: "10" }}
                            disabled={!isYourTurn}
                            onClick={handleClick}
                        >
                            Roll Dice
                        </button>
                    )}
                    {rolled && (
                        <button
                            className="z-30 border cursor-pointer text-[8px]"
                            style={{ gridColumn: "7", gridRow: "10" }}
                            disabled={!isYourTurn}
                            onClick={handleEnd}
                        >
                            End Turn
                        </button>
                    )}
                    {isOffering && <OfferTrade recipient = {tradingWith}/>}
                    {isOffered && <OfferedTrade tradeOffer={offeredTrade}/>}
                    {isBuying && !passed && <BuyPrompt space={landedOn} />}
                    {isPaying && <PayRentPrompt space={landedOn}/>}
                    {isOwn && !passed && <YourOwnPrompt space={landedOn}/>}
                    {isViewing && <OwnedProp space={viewing} />}
                </MonopolyBoard>
            </div>
    
            {/* Right Hand (Bottom on small screens) */}
            <div className="w-full md:w-[23%] flex justify-center items-start p-2">
                <RightHand players={oPP} />
            </div>
        </div>
    );
}
export default Play;
