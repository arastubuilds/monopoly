import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./authStore";



export const useGameStore = create((set) => ({

    game: null,
    yourMoney: 0, 
    yourProperties: [],
    oPP: [],
    viewing: null,
    landedOn: null,
    tradingWith: null,
    offeredTrade: null,
    isCreating: true,
    isJoining: false,
    isStarting: false,
    isRolling: false,
    isYourTurn: false,
    isBuying: false,
    isPassing: false,
    isPaying: false,
    isViewing: false,
    isOffering: false,
    isOffered: false,
    isOwn: false,
    passed: false,
    ready: false,
    joined: false,
    started: false,
    rolled: false,
    dice: 0,

    create: async () => {
        set({game: null});
        try {
            const res = await axiosInstance.post("/game/create");
            
            // console.log(res.data);
            set({ game: res.data.game });
            
            toast.success("Game created successfully");

        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            set({isCreating: false});
        }
    },
    join: async (code) => {
        set({game: null, isJoining: true});
        try {
            const res = await axiosInstance.post(`/game/join/${code}`);
            // console.log(res.data);            
            
            set({game: res.data.game, joined: true});
            
            // await offerUsersInRoom(res.data.usersInRoom);

            toast.success("Game Joined Successfully");
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            set({isJoining: false});
        }
    },
    start: async (code) => {
        set({game: null, isStarting: true});
        try {
            const res = await axiosInstance.post(`/game/start/${code}`);
            set({game: res.data.game, started: true});
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({isStarting: false});
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
    roll: async(code) => {
        set({isRolling: true});
        try {
            const res = await axiosInstance.post(`/game/${code}/roll`);
            set({game: res.data.game, dice: res.data.number, rolled: true});
            set({isBuying: res.data.buy, isPaying: res.data.pay, isOwn: res.data.own, landedOn: res.data.landedOn});
            toast(res.data.message);

        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({isRolling: false});
        }
    },
    end: async (code) => {
        try {
            const res = await axiosInstance.post(`/game/${code}/endTurn`);
            set({isYourTurn: false, rolled: false, passed: false, landedOn: null});
            toast.success(res.data.message);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },
    buy: async (code) => {
        try {
            const res = await axiosInstance.post(`/game/${code}/buy`);
            // console.log(res.data.yourProperties);
            set({game: res.data.game, isBuying: false});
            set({yourProperties: res.data.yourProperties, yourMoney: res.data.yourMoney});
            toast.success(res.data.message);
        } catch (error) {
            toast.error(error.response.data.message);   
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
    setIsOffering: (isOffering) => set({isOffering}),
    setTradingWith: (tradingWith) => set({tradingWith}),
    setIsPassing: (isPassing) => set({isPassing}),
    setYourMoney: (yourMoney) => set({yourMoney}),
    setYourProperties: (yourProperties) => set({yourProperties}),
    setIsOffered: (isOffered) => set({isOffered}),
    setOfferedTrade: (offeredTrade) => set({offeredTrade}),
    setOPP: (oPP) => {set({oPP}); console.log("oPP", oPP)},
    setGame: (game) => set({game}),
}));