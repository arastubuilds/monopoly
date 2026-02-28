import { create } from "zustand";
// import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

import { useAuthStore } from "./authStore";
import { useTokenStore } from "./useTokenStore";



export const useGameStoreUsingSocket = create((set, get) => ({
    game: null,
    idToIndexMap: null,
    players: null,
    isHost: false,
    code: -1,
    numPlayers: 0,
    yourMoney: 0, 
    yourIndex: -1,
    yourProperties: [],
    oPP: [],
    viewing: null,
    landedOn: null,
    tradingWith: null,
    offeredTrade: null,
    isCreating: true,
    isJoining: false,
    isLoading: false,
    isStarting: false,
    isRolling: false,
    isYourTurn: false,
    isBuying: false,
    isPassing: false,
    isPaying: false,
    isViewing: false,
    isViewingOwnProps: false,
    isViewingOthersProps: false,
    isOffering: false,
    isOffered: false,
    isOwn: false,
    passed: false,
    ready: false,
    joined: false,
    loaded: false,
    started: false,
    rolled: false,
    dice: {die1: 1, die2: 1},
    rolledDice: null,
    socket: null,
    create: () => {
        set({game: null});
        try {
            // const res = await axiosInstance.post("/game/create");
            const socket = useAuthStore.getState().socket;
            set({socket});
            socket.emit("socket:create-game");
            // console.log(res.data);
            // set({ game: res.data.game, code: res.data.game.code, isHost: res.data.isHost});
            // toast.success("Game created successfully");

        } catch (error) {
            console.log(error);
            // toast.error(error.response.data.message);
        } finally {
            set({isCreating: false});
        }
    },
    join: (code) => {
        set({game: null, isJoining: true});
        try {
            // const res = await axiosInstance.post(`/game/join/${code}`);
            // const socket = useAuthStore((state) => state.socket);
            // if (!socket) return;
            const socket = useAuthStore.getState().socket;
            console.log(socket);
            socket.emit("socket:join-game", { code });
            set({socket, joined: true});
            // console.log(res.data);            
            
            // set({ game: res.data.game, joined: true });
            
            // await offerUsersInRoom(res.data.usersInRoom);

            // toast.success("Game Joined Successfully");
        } catch (error) {
            console.log(error);
            // toast.error(error.response.data.message);
        } finally {
            set({isJoining: false});
        }
    },
    load: async (code) => {
        set({game: null, isLoading: false});
        try {
            const res = await axiosInstance.post(`/game/load/${code}`);
            set({game: res.data.game, loaded: true, isHost: res.data.isHost});
            console.log(res.data.game);
            toast.success("Game Loaded Successfully");
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
         }finally {
            set({isLoading: false});
        }
    },
    start: async (code) => {
        set({game: null, isStarting: true});
        try {
            // const res = await axiosInstance.post(`/game/start/${code}`);
            // set({game: res.data.game, started: true, numPlayers: res.data.game.players.length});
            // console.log(res.data.game.players.length);
            const socket = useAuthStore.getState().socket;
            socket.emit("socket:start-game", {code});
            
        } catch (error) {
            // toast.error(error.response.data.message);
        } finally {
            set({isStarting: false});
        }
    },
    end: async(code) => {
        set({isEnding: true});
        try {
            const res = await axiosInstance.post(`/game/end/${code}`);
        } catch (error) {
            
        }
    },
    ready: async () => {
        try {
            const res = await axiosInstance.post(`/game/ready`);
            set({isReady: true});
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },
    closeOwn: () => {
        set({isViewing: false, viewing: null});
    },
    closeTrade: () => {
        set({tradingWith: null, isOffering: false});
    },
    roll: (code) => {
        set({isRolling: true});
        try {
            // const res = await axiosInstance.post(`/game/${code}/roll`);
            // set({game: res.data.game, dice: res.data.dice, rolled: true});
            const socket = useAuthStore.getState().socket;
            console.log(get().game.code);
            
            socket.emit("socket:roll-dice", {code: get().game.code});
            // return new Promise((resolve) => {
            //     setTimeout(async () => {
            //         // set({isRolling: false});                    
            //         useTokenStore.getState().animateTokenToTile(res.data.yourIndex, res.data.landedOn.id);
                    
            //         set({isBuying: res.data.buy, isPaying: res.data.pay, isOwn: res.data.own, landedOn: res.data.landedOn });
                    
            //         toast(res.data.message);        
            //         // console.log(res.data.landedOn);
            //         // console.log(res.data.dice);
                    
            //         set({isRolling: false});
            //         resolve();
                    
            //     }, 2200);
            // });
            
        } catch (error) {
            set({isRolling: false});
            console.log(error);
            // toast.error(error.response.data.message);
        }
    },
    end:  (code) => {
        try {
            // const res = await axiosInstance.post(`/game/${code}/endTurn`);
            // toast.success(res.data.message);
            set({isYourTurn: false, rolled: false, passed: false, landedOn: null});
            const socket = useAuthStore.getState().socket;
            socket.emit("socket:end-turn", { code: get().game.code });
        } catch (error) {
            toast.error(error);
        }
    },
    buy: async (code) => {
        try {
            // const res = await axiosInstance.post(`/game/${code}/buy`);
            // console.log(res.data.yourProperties);
            // set({game: res.data.game, isBuying: false});
            const socket = useAuthStore.getState().socket;
            socket.emit("socket:buy-prop", { code: get().game.code });
            // set({yourProperties: res.data.yourProperties, yourMoney: res.data.yourMoney});
            // toast.success(res.data.message);
        } catch (error) {
            toast.error(error);   
        }
    },
    pay: async (code, recipient, space) => {
        try {
            const res = await axiosInstance.post(`/game/${code}/pay`, {recipient, space});
            set({game: res.data.game, isPaying: false, yourMoney: res.data.yourMoney, oPP: res.data.otherPlayersProperties});
            toast(`${res.data.message}`)
            // console.log(res.data.)
        } catch (error) {
            console.log(error.message);
            toast.error(error.response.data.message);
        }
    },
    offerTrade: async(code, recipient, tradeOffer) => {
        try {
            const res = await axiosInstance.post(`/game/${code}/offer-trade`, {recipient, tradeOffer});
            toast(`${res.data.message}`);
        } catch (error) {
            console.log(error.message);
            toast.error(error.response.data.message);
        }
    },
    rejectOffer: async(code, tradeOffer) => {
        try {
            const res = await axiosInstance.post(`/game/${code}/reject-offer`, { tradeOffer });
            set({isOffered: false, offeredTrade: null});
            toast.success(`${res.data.message}`);
        } catch (error) {
            console.log(error.message);
            toast.error(`${error.response.data.message}`);
        }
    },
    acceptOffer: async(code, tradeOffer) => {
        try {
            const res = await axiosInstance.post(`/game/${code}/accept-offer`, { tradeOffer });
            set({game: res.data.game, isOffered: false, offeredTrade: null});
            set({yourProperties: res.data.yourProperties, yourMoney: res.data.yourMoney});

            const user = useAuthStore.getState().authUser;
            
            const otherPlayersProperties = res.data.otherPlayersProperties.filter((opp) => {
                return opp.player.userId._id.toString() !== user._id.toString();
            });
            console.log(res.data.game.boardState);
            set({oPP: otherPlayersProperties});
            toast.success(`${res.data.message}`);
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    },
    pass: () => {
        console.log("passed");
        set({passed: true, isPassing: false, isBuying: false}); 
    },

    setIsYourTurn: (isYourTurn) => set({isYourTurn}),
    setLandedOn: (landedOn) => set({landedOn}),
    setIsBuying: (isBuying) => set({isBuying}),
    setIsViewing: (viewing) => set({isViewing: true, viewing}),
    setIsViewingOwnProps : (isViewingOwnProps) => set({isViewingOwnProps}),
    setIsViewingOthersProps : (isViewingOthersProps) => set({isViewingOthersProps}),
    setIsOffering: (isOffering) => set({isOffering}),
    setTradingWith: (tradingWith) => set({tradingWith}),
    setIsPassing: (isPassing) => set({isPassing}),
    setYourMoney: (yourMoney) => set({yourMoney}),
    setYourProperties: (yourProperties) => set({yourProperties}),
    setIsOffered: (isOffered) => set({isOffered}),
    setOfferedTrade: (offeredTrade) => set({offeredTrade}),
    setOPP: (oPP) => {set({oPP}); console.log("oPP", oPP)},
    setNumPlayers: (numPlayers) => set({numPlayers}),
    setIdToIndexMap : (idToIndexMap) => set({idToIndexMap}),
    setYourIndex: (yourIndex) => set({yourIndex}),
    setPlayers: (players) => set({players}),
    setCode: (code) => set({code}),
    setGame: (game) => set({game}),
    setIsHost: (isHost) => set({isHost}),
    setIsRolling: (isRolling) => set({isRolling}),
    setIsBuying: (isBuying) => set({isBuying}),
    setIsPaying: (isPaying) => set({isPaying}),
    setIsOwn: (isOwn) => set({isOwn}),
    setRolled: (rolled) => set({rolled}),
    setDice: (dice) => {set({dice})},
    setRolledDice: (rolledDice) => {set({rolledDice});}
}));