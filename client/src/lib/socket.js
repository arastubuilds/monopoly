import { useAuthStore } from "../store/authStore";
import { useGameStore } from "../store/gameStore";
import toast from "react-hot-toast";

export const registerBasicEvents = () => {

    const user = useAuthStore.getState().authUser;

    const socket = useAuthStore.getState().socket;
    const setGame = useGameStore.getState().setGame;
    const setIsYourTurn = useGameStore.getState().setIsYourTurn;

    if (!socket) return;

    socket.on("joined-room", (game) => {
        console.log("player joined room");
        toast.success("Player Joined");
        setGame(game);
    });
    
    socket.on("game-started", (game) => {
        console.log("game started");
        toast.success("Game Started");
        setGame(game);
    });

    socket.on("player-turn", (res) => {
        if (res._id === user._id) { 
            toast.success(`Your Turn`); 
            setIsYourTurn(true);
        } else {
            toast.success(`${res.username}'s turn`);
            setIsYourTurn(false);
        }
    });

};
export const unregisterBasicEvents = () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("joined-room");
    socket.off("game-started");
    socket.off("player-turn");
};
export const registerPlayerEvents = () => {
    
    const user = useAuthStore.getState().authUser;

    const socket = useAuthStore.getState().socket;
    const setGame = useGameStore.getState().setGame;
    const setYourMoney = useGameStore.getState().setYourMoney;
    const setYourProperties = useGameStore.getState().setYourProperties;
    const setIsYourTurn = useGameStore.getState().setIsYourTurn;
    const setIsOffering = useGameStore.getState().setIsOffering;
    const setTradingWith = useGameStore.getState().setTradingWith;
    const setOPP = useGameStore.getState().setOPP;
    const setIsOffered = useGameStore.getState().setIsOffered;
    const setOfferedTrade = useGameStore.getState().setOfferedTrade;

    if (!socket) return;

    socket.on("dice-rolled", (res) => {
        toast.success(`${res.name.username} rolled a ${res.num}`);
        setGame(res.game);
    });

    socket.on("landed-unowned-prop", (res) => {
        // setLandedOn(res.space);
        // setIsBuying(true);
        toast.success(`Landed on ${res.space.name}`)
    });
    socket.on("landed-owned-prop", (res) => {
        toast(`Landed on ${res.space.name} owned by ${res.space.owner.username}. Rent owed is ${res.space.base}`);
    });
    socket.on("landed-your-prop", (res) => {
        toast(`Landed on their own ${res.space.name}`);
    });
    socket.on("paid-rent", (res) => {
        if (res.reciever.userId._id.toString() === user._id.toString()){
            setYourMoney(res.yourMoney);
            toast.success(`${res.player.userId.username} paid you $${res.space.base}`); 
        }
        else
            toast(`${res.player.userId.username} paid ${res.reciever.userId.username} $${res.space.base}`);

        const otherPlayersProperties = res.otherPlayersProperties.filter((opp) => {
            return opp.player.userId._id.toString() !== user._id.toString();
        })

        // console.log(otherPlayersProperties);
        setOPP(otherPlayersProperties);
        setGame(res.game);
    });
    socket.on("player-turn", (res) => {
        console.log(res);
        
        if (res.currentTurn._id.toString() === user._id.toString()) { 
            toast.success(`Your Turn`); 
            setIsYourTurn(true);
        } else {
            toast.success(`${res.currentTurn.username}'s turn`);
            setIsYourTurn(false);
        }
        setGame(res.game);
    });
    
    socket.on("end-turn", (res) => {
        // setIsYourTurn(false);
        toast.success(`${res.username}'s turn ended`);
    });

    socket.on("property-bought", (res) => {
        toast.success(`${res.player} bought ${res.property}`);
        
        const otherPlayersProperties = res.otherPlayersProperties.filter((opp) => {
            return opp.player.userId._id.toString() !== user._id.toString();
        });

        console.log(otherPlayersProperties);
        setOPP(otherPlayersProperties);
        setGame(res.game);
    });
    socket.on("trade-offer", (res) => {
        if (res.reciever.userId._id.toString() === user._id.toString()){
            console.log("offer", res.tradeOffer);
            setIsOffered(true);
            setOfferedTrade(res.tradeOffer);
        toast.success(`${res.tradeOffer.sender.username} offers a trade`);
        }
    });
    socket.on("trade-accepted", (res) => {
        if (res.sender.userId._id.toString() === user._id.toString()) {
            toast.success(`Trade Successful`);
            setYourProperties(res.senderProperties);
            setYourMoney(res.sender.money);
            setIsOffering(false);
            setTradingWith(null);
        }
        
        const otherPlayersProperties = res.otherPlayersProperties.filter((opp) => {
            return opp.player.userId._id.toString() !== user._id.toString();
        });

        // console.log(otherPlayersProperties);
        
        setOPP(otherPlayersProperties);
        setGame(res.game);
    });
};
export const unregisterPlayerEvents = () => {
    const socket = useAuthStore.getState().socket;

    if (!socket) return;
    socket.off("dice-rolled");
    socket.off("landed-unowned-prop");
    socket.off("player-turn");
    socket.off("end-turn");
    socket.off("property-bought");
};  

