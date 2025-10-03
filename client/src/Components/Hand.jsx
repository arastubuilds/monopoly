import { useGameStore } from "../store/gameStore";
// import VoiceChat from "./VoiceChat";

const Hand = ({ owned, money=0 }) => {
    // console.log(owned);
    const {setIsViewing} = useGameStore();
    return (
        <div className="bg-white max-w-1/3 max-h-1/2 absolute left-0 border-4 border-red-600 rounded-xl p-4 md:shadow-2xl font-mono lg:top-15 top-10">
            <h2 className="text-xl font-bold text-red-600 mb-1 text-center flex justify-center">
                Your Properties
                {/* <VoiceChat /> */}
            </h2>
            {/* <p className="text-sm text-gray-700 font-semibold mb-4 text-center">
                ${money?.toString()}
            </p> */}
            <div className="flex flex-wrap gap-3 overflow-y-auto scrollbar-thin scrollbar-thumb-red-500 scrollbar-track-red-100 justify-center">
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
