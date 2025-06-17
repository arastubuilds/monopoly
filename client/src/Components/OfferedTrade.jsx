import { useGameStore } from "../store/gameStore";

const OfferedTrade = ({ tradeOffer  }) => {
    const { game, acceptOffer } = useGameStore();
    const { sender, senderOffer, senderAsk, recipient } = tradeOffer;
    const handleAccept = async () => { await acceptOffer(game?.code, tradeOffer) };
    const handleDecline = () => {};
    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex flex-col items-center justify-center">
            <div className="bg-white rounded-xl border-4 border-red-600 px-8 py-6 text-center font-mono w-[90%] max-w-5xl shadow-2xl flex flex-col gap-6 sm:flex-row justify-between">
                
                {/* Sender's Offer */}
                <div className="flex-1 border-4 border-red-600 rounded-lg p-4">
                    <h2 className="text-2xl font-bold text-red-600 mb-2">{sender.username} Offers</h2>
                    <p className="text-gray-800 mb-2">
                        <span className="font-bold">${senderOffer.senderMoney}</span>
                    </p>

                    {senderOffer.senderProp.length ? (
                        <div className="grid grid-cols-2 gap-2">
                            {senderOffer.senderProp.map((prop, index) => (
                                <div
                                    key={index}
                                    className="bg-red-100 border border-red-300 text-red-800 font-semibold rounded p-2"
                                >
                                    {prop.name}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No properties offered</p>
                    )}
                </div>

                {/* Sender's Ask */}
                <div className="flex-1 border-4 border-red-600 rounded-lg p-4">
                    <h2 className="text-2xl font-bold text-red-600 mb-2">{recipient.player.userId.username} Gives</h2>
                    <p className="text-gray-800 mb-2">
                        <span className="font-bold">${senderAsk.askedMoney}</span>
                    </p>

                    {senderAsk.askedProp.length ? (
                        <div className="grid grid-cols-2 gap-2">
                            {senderAsk.askedProp.map((prop, index) => (
                                <div
                                    key={index}
                                    className="bg-red-100 border border-red-300 text-red-800 font-semibold rounded p-2"
                                >
                                    {prop.name}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No properties requested</p>
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
                <button
                    className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 transition-all"
                    onClick={handleDecline}
                >
                    Decline
                </button>
                <button
                    className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition-all"
                    onClick={handleAccept}
                >
                    Accept
                </button>
            </div>
        </div>
    );
};

export default OfferedTrade;
