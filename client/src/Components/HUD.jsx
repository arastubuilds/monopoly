import { useGameStore } from "../store/gameStore";
// import VoiceChat from "./VoiceChat";

export default function HUD () {
    const yourMoney = useGameStore((state) => state.yourMoney);
    
    const setIsViewingOwnProps = useGameStore.getState().setIsViewingOwnProps;
    const isViewingOthersProps = useGameStore((state) => state.isViewingOthersProps);
    const isViewingOwnProps = useGameStore((state) => state.isViewingOwnProps);
    const setIsViewingOthersProps = useGameStore.getState().setIsViewingOthersProps;

    return (
        <div className="h-[8%] w-[99%] flex justify-between absolute top-1.5">
            <div className="bg-black/20 w-1/5 h-full border-none rounded-full flex items-center justify-center">
                <div className="w-[95%] h-3/4 flex items-center justify-evenly bg-white/80 border rounded-full">
                    
                    <span className="w-1/2 text-center lg:text-lg text-xs truncate">Arastu Vij</span>
                    <span className="w-1/3 text-center lg:text-lg text-xs">${yourMoney || 15000}</span>
                    <button className="w-1/3 z-100 text-center lg:text-lg text-xs hover:text-red" 
                        onClick={() => {
                                setIsViewingOwnProps(!isViewingOwnProps)
                            }
                        }
                    >
                        {isViewingOwnProps ? "Close" : "View"}
                    </button>
                    {/* <div className="w-1/3 flex justify-center lg:text-lg text-xs"><VoiceChat /></div> */}

                </div>
            </div>
            <div className="bg-black/20 w-1/5 h-full border-none rounded-full flex items-center justify-center">
                    <div className="w-[95%] h-3/4 flex items-center justify-evenly bg-white/80 border rounded-full">
                    <span className="w-1/2 text-center lg:text-lg text-xs truncate">Others</span>
                    {/* <span className="w-1/3 text-center lg:text-lg text-xs">${yourMoney || 15000}</span> */}
                    <button className="w-1/3 z-100 text-center lg:text-lg text-xs hover:text-red" 
                        onClick={() => {
                                setIsViewingOthersProps(!isViewingOthersProps)
                            }
                        }
                    >
                        {isViewingOthersProps ? "Close" : "View"}
                    </button>
                    {/* <div className="w-1/3 flex justify-center lg:text-lg text-xs"><VoiceChat /></div> */}

                </div>
            </div>
        </div>
    )
}