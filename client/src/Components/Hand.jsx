import { useGameStore } from "../store/gameStore";
import VoiceChat from "./VoiceChat";

const Hand = ({ owned, money }) => {
    // console.log(owned);
    const {setIsViewing} = useGameStore();
    return (
        <div className="bg-white border-4 border-red-600 rounded-xl p-4 w-full md:shadow-2xl font-mono mb-4 md:mb-0 md:ml-6">
            <h2 className="text-xl font-bold text-red-600 mb-1 text-center flex justify-between">
                Your Properties
                <VoiceChat />
            </h2>
            <p className="text-sm text-gray-700 font-semibold mb-4 text-center">
                ${money?.toString()}
            </p>
            <div className="flex flex-wrap gap-3 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-red-500 scrollbar-track-red-100 justify-center">
                {owned.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center w-full">No properties yet</p>
                ) : (
                    owned.map((property, index) => (
                        <div
                            key={index}
                            className="bg-red-100 text-red-700 font-semibold text-sm rounded-md p-3 border border-red-300 flex flex-col items-center justify-between shadow-md"
                        >
                            <span className="text-center truncate w-full">
                                {property.name}
                            </span>
                            <button className="mt-2 bg-red-400 hover:bg-red-500 text-white text-xs py-1 px-3 rounded"
                                onClick={() => setIsViewing(property)}
                            >
                                View
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Hand;
