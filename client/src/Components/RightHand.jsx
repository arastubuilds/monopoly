import { useGameStore } from "../store/gameStore";

const RightHand = ({ players }) => {
    // console.log(players);
    const { setIsOffering, setTradingWith } = useGameStore();
    return (
        <div className="bg-white border-4 border-red-600 rounded-xl p-4 w-full shadow-2xl font-mono mb-4 md:mb-0 md:mr-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-red-600 mb-4 text-center">
                Player Properties
            </h2>
            {players?.length === 0 ? (
                <p className="text-sm text-gray-500 text-center">No players yet</p>
            ) : (
                players?.map(({ player, properties }, index) => (
                    <div key={index} className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-md font-bold text-red-700 underline">
                                {player?.userId?.username || "Unnamed Player"}
                            </h3>
                            <p className="text-sm text-gray-700 font-semibold">
                                ${player?.money?.toString() || 0}
                            </p>
                            <button
                                className="ml-2 px-2 py-1 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition-all text-xs"
                                onClick={() => {setIsOffering(true); setTradingWith({player, properties})} }
                            >
                                Trade
                            </button>
                        </div>
                        {properties.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center">No properties</p>
                        ) : (
                            <div className="space-y-2">
                                {properties.map((property, i) => (
                                    <div
                                        key={i}
                                        className="flex justify-between items-center bg-red-100 text-red-700 font-semibold text-sm rounded-md px-2 py-1 border border-red-300"
                                    >
                                        <span>{property.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default RightHand;
