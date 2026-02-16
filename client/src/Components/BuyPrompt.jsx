import { useState } from "react";
import { useGameStore } from "../store/gameStore";
import { useGameStoreUsingSocket } from "../store/gameStoreUsingSocket";

const BuyPrompt = ({ space  }) => {
    const [buying, setBuying] = useState(false);
    const [passing, setPassing] = useState(false);
    // const { game, buy, pass } = useGameStore();
    const { game, buy, pass } = useGameStoreUsingSocket();
    const handleBuy =  () =>  { setBuying(true);  buy(game?.code); setBuying(false); };
    const handlePass = () => { setPassing(true); pass(); setPassing(false); };
    
    if (!space) return null;

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl border-4 border-red-600 px-8 py-6 text-center font-mono w-[90%] max-w-md shadow-2xl">
                
                <h2 className="text-3xl font-bold text-red-600 mb-2">
                    {space.name}
                </h2>
                
                {space.price ? (
                    <>
                        <p className="text-lg text-gray-800 mb-6">
                            Would you like to purchase this property for
                            <span className="font-bold"> ${space.price}</span>?
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <button
                                className="w-full sm:w-32 h-12 bg-red-600 text-white rounded-lg font-bold text-lg hover:bg-red-700 transition-all"
                                onClick={handleBuy}
                            >
                                {buying ? "Buying..." : "Buy"}
                            </button>
                            <button
                                className="w-full sm:w-32 h-12 bg-white text-red-600 border-4 border-red-600 rounded-lg font-bold text-lg hover:bg-red-600 hover:text-white transition-all"
                                onClick={handlePass}
                            >
                                {passing ? "Passing..." : "Pass"}
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <p className="text-gray-600">This space cannot be purchased.</p>
                            <button
                            className="w-full sm:w-32 h-12 bg-white text-red-600 border-4 border-red-600 rounded-lg font-bold text-lg hover:bg-red-600 hover:text-white transition-all"
                            onClick={handlePass}
                            >
                        {passing ? "Passing..." : "Pass"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BuyPrompt;
