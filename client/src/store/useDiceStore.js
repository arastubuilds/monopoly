import { create } from "zustand";

export const useDiceStore = create((set) => ({
    isRolling: false,
    dice1Value: 1,
    dice2Value: 1,

    rollDice: (num1, num2) => {
        return new Promise((resolve) => {
            const newDice1 = num1;
            const newDice2 = num2;
    
            set({
                isRolling: true,
                dice1Value: newDice1,
                dice2Value: newDice2
            });
            setTimeout(() => {
                set({isRolling: false});
                resolve();
            }, 2200);
        });
    },

    setRolling: (value) => set({ isRolling: value }),
}));