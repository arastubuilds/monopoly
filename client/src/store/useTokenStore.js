import { create } from "zustand";


export const useTokenStore = create((set) => ({
    tokens: [],
    tokenColors: ["red", "skyblue", "green", "yellow", "silver", "hotpink"],
    createTokens: (length) => {
        // const length = useGameStore((state) => state.numPlayers);
        
        // const players = useGameStore.getState()
        const tokens = Array.from({length}).map((_, index) => {
            return {tileIndex: 0, toTileIndex: null};
        });
        set({tokens});
        console.log(tokens);
    },
    setTokenTileIndex: (index, tileIndex) => set((state) => {
        // tileIndex = getPositionByIndex(tileIndex);
        const tokens = [...state.tokens];
        tokens[index] = {
            ...tokens[index],
            tileIndex,
            toTileIndex: null,
        };
        console.log(tokens);
        return {tokens};
    }),
    
    animateTokenToTile: (index, toTileIndex) => set((state) => {
        // toTileIndex = getPositionByIndex(toTileIndex);
        console.log(toTileIndex);
        
        const tokens = [...state.tokens];
        tokens[index] = {
            ...tokens[index],
            toTileIndex,
        };
        console.log(tokens);
        return {tokens};
        // return new Promise((resolve) => {
        //     setTimeout(() => {
        //         resolve();
        //         return {tokens};
        //     }, 2200);
        // });
    })
}));

function getPositionByIndex(index) {
    if (index >=0 && index <= 10) return index;
    return (50 - index)
}