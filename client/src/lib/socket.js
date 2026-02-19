import { useAuthStore } from "../store/authStore";
import { useGameStore } from "../store/gameStore";
import toast from "react-hot-toast";
import { useTokenStore } from "../store/useTokenStore";
import { useGameStoreUsingSocket } from "../store/gameStoreUsingSocket";

export const registerBasicEvents = () => {

    const user = useAuthStore.getState().authUser;

    const socket = useAuthStore.getState().socket;
    const setGame = useGameStore.getState().setGame;
    const setIdToIndexMap = useGameStore.getState().setIdToIndexMap;
    const setYourIndex = useGameStore.getState().setYourIndex;
    const setNumPlayers = useGameStore.getState().setNumPlayers;
    const setPlayers = useGameStore.getState().setPlayers;
    const setCode = useGameStore.getState().setCode;
    const setIsYourTurn = useGameStore.getState().setIsYourTurn;
    
    const setGameSocket = useGameStoreUsingSocket.getState().setGame;
    const setIsHostSocket = useGameStoreUsingSocket.getState().setIsHost;
    const setIsYourTurnSocket = useGameStoreUsingSocket.getState().setIsYourTurn;
    if (!socket) return;

    // { message: "Game Created Successfully", game, isHost: true }
    socket.on("socket:create-game:success", (res) => {
        console.log(res.message);
        setGameSocket(res.game);
        setIsHostSocket(res.isHost);
    });
    socket.on("socket:join-game:success", (res) => {
        console.log(res.message);
        // setGameCode(res.game)
        setGameSocket(res.game);
    });
    socket.on("socket:start-game:success", (res) => {
        console.log(res.game.currentTurn.userName+" current turn");
        if (res.game.currentTurn.userId.toString() === user._id.toString()){
            toast.success('Your Turn');
            setIsYourTurnSocket(true);
        } else {
            toast.success(`${res.game.currentTurn.userName.toString()}'s Turn`);
            setIsYourTurnSocket(false);
        }
        setGameSocket(res.game);
    });
    socket.on("joined-room", (res) => {
        console.log("player joined room");
        toast.success("Player Joined");
        // setGame(game);
        console.log(res.game.players);
        
        setGameSocket(res.game);
    });
    socket.on("game-started", ({game}) => {
        // let idToIndexMap = game.idToIndexMap
        // console.log(game.currentTurn+" current turn");
        console.log("game started");
        toast.success("Game Started");
        setGameSocket(game);
        if (game.currentTurn.userId.toString() === user._id.toString()){
            toast.success('Your Turn');
            setIsYourTurnSocket(true);
        } else {
            toast.success(`${game.currentTurn.userName.toString()}'s Turn`);
            setIsYourTurnSocket(false);
        }
        // setIdToIndexMap(idToIndexMap);
        // setCode(game.code);
        // setNumPlayers(game.players.length);
        // setYourIndex(idToIndexMap[user._id.toString()]);
        // setPlayers(game.players);
        // console.log(idToIndexMap[user._id.toString()]);
    });

    // socket.on("player-turn", (res) => {
    //     // if (res._id === user._id) { 
    //     //     toast.success(`Your Turn`); 
    //     //     setIsYourTurn(true);
    //     // } else {
    //     //     toast.success(`${res.username}'s turn`);
    //     //     setIsYourTurn(false);
    //     // }
    //     console.log(res);
    //     if (res.currentTurn._id.toString() === user._id.toString()) { 
    //         toast.success(`Your Turn`); 
    //         setIsYourTurn(true);
    //     } else {
    //         toast.success(`${res.currentTurn.username}'s turn`);
    //         setIsYourTurn(false);
    //     }
    //     setGame(res.game);
    // });
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
    // const setGame = useGameStore.getState().setGame;
    // const setYourMoney = useGameStore.getState().setYourMoney;
    // const setYourProperties = useGameStore.getState().setYourProperties;
    // const setIsYourTurn = useGameStore.getState().setIsYourTurn;
    // const setIsOffering = useGameStore.getState().setIsOffering;
    // const setTradingWith = useGameStore.getState().setTradingWith;
    // const setOPP = useGameStore.getState().setOPP;
    // const setIsOffered = useGameStore.getState().setIsOffered;
    // const setOfferedTrade = useGameStore.getState().setOfferedTrade;
    
    const setGame = useGameStoreUsingSocket.getState().setGame;
    const setYourMoney = useGameStoreUsingSocket.getState().setYourMoney;
    const setYourProperties = useGameStoreUsingSocket.getState().setYourProperties;
    const setIsYourTurn = useGameStoreUsingSocket.getState().setIsYourTurn;
    const setIsOffering = useGameStoreUsingSocket.getState().setIsOffering;
    const setTradingWith = useGameStoreUsingSocket.getState().setTradingWith;
    const setOPP = useGameStoreUsingSocket.getState().setOPP;
    const setIsOffered = useGameStoreUsingSocket.getState().setIsOffered;
    const setOfferedTrade = useGameStoreUsingSocket.getState().setOfferedTrade;
    const setIsRolling = useGameStoreUsingSocket.getState().setIsRolling;
    const setIsBuying = useGameStoreUsingSocket.getState().setIsBuying;
    const setIsPaying = useGameStoreUsingSocket.getState().setIsPaying;
    const setIsOwn = useGameStoreUsingSocket.getState().setIsOwn;
    const setLandedOn = useGameStoreUsingSocket.getState().setLandedOn;
    const setRolled = useGameStoreUsingSocket.getState().setRolled;
    const setDice = useGameStoreUsingSocket.getState().setDice;
    const setRolledDice = useGameStoreUsingSocket.getState().setRolledDice;
    const setIsYourTurnSocket = useGameStoreUsingSocket.getState().setIsYourTurn;

    const animateTokenToTile = useTokenStore.getState().animateTokenToTile;

    if (!socket) return;


    socket.on("socket:roll-dice:success", ({res}) => {
        setRolledDice(res.dice);
        // console.log("dice from socket:", res.dice);
        setIsRolling(false);
        setRolled(true);
        setTimeout(() => {
            animateTokenToTile(res.yourIndex, res.landedOn.id);
        
            // set({isBuying: res.buy, isPaying: res.pay, isOwn: res.own, landedOn: res.landedOn });  
            setIsBuying(res.buy);
            setIsPaying(res.pay);
            setIsOwn(res.own);
            setLandedOn(res.landedOn);
            toast(res.message);
        }, 2200);
            // console.log(res.data.landedOn);
            // console.log(res.data.dice);
    })
    socket.on("socket:end-turn:success", (res) => {
        // console.log(res.game.currentTurn+" current turn");
        if (res.currentTurn.userId.toString() === user._id.toString()){
            toast.success('Your Turn');
            setIsYourTurnSocket(true);
        } else {
            toast.success(`${res.currentTurn.userName.toString()}'s Turn`);
            setIsYourTurnSocket(false);
        }
        setGame(res.game);
    });
    socket.on("socket:buy-prop:success", ({result, game}) => {
        setIsBuying(false);
        setGame(game);
        setYourProperties(result.yourProperties);
        setYourMoney(result.yourMoney);
        toast.success(`${result.message}`);
    });
    socket.on("dice-rolled", ({res, game}) => {
        // console.log(res);
        animateTokenToTile(res.yourIndex, res.landedOn.id);
        setGame(game);
        toast(`${game.currentTurn.userName.toString()} ${res.message}`);
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
    // socket.on("player-turn", (res) => {
    //     // console.log(res);
    //     if (res.currentTurn.toString() === user._id.toString()) { 
    //         toast.success(`Your Turn`); 
    //         setIsYourTurnSocket(true);
    //     } else {
    //         toast.success(`${res.currentTurn.toString()}'s turn`);
    //         setIsYourTurnSocket(false);
    //     }
    //     setGame(res.game);
    // });
    
    // socket.on("end-turn", (res) => {
    //     // setIsYourTurn(false);
    //     toast.success(`${res.username}'s turn ended`);
    // });

    socket.on("property-bought", (res) => {
        toast.success(`${res.message}`);
        
        const otherPlayersProperties = res.otherPlayersProperties.filter((opp) => {
            return opp.player.userId.toString() !== user._id.toString();
        });

        // console.log(otherPlayersProperties);
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
        console.log(res.game.boardState);
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

