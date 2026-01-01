import { Server } from "socket.io";
import http from "http";
import express from "express";
import { getGameInstance } from "./gameState.js";
import { getGameSession } from "./gameStateNew.js";
import GameModel from "../models/game.model.js";

const app = express();
const server = http.createServer(app);

// const CLIENT_URL = process.env.NODE_ENV === "production" ? "/" : process.env.CLIENT_URL;
const CLIENT_URL = process.env.CLIENT_URL;
const io = new Server(server, {
    // connectionStateRecovery: {
    //     maxDisconnectionDuration: 2*60*1000,
    //     skipMiddlewares: true,
    // },
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    },
});

const userSocketMap = {};

export function getSocket(userId) {
    return userSocketMap[userId];
}

io.on("connection", (socket) => {
    console.log("a user connected", socket.id);
    
    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket;

    //WebRTC Signalling
    socket.on('offer', ({ targetId, offer }) => {
        console.log(`offering to ${targetId}`);
        io.to(targetId).emit('offer', { fromId: socket.id, offer });
    });

    socket.on('answer', ({ targetId, answer }) => {
        console.log(`answering to ${targetId}`);
        io.to(targetId).emit('answer', { fromId: socket.id, answer });
    });

    socket.on('ice-candidate', ({ targetId, candidate }) => {
        console.log(`ice-candidate to ${targetId}`);
        io.to(targetId).emit('ice-candidate', { fromId: socket.id, candidate });
    });

    // Game socket events
    socket.on("socket:join-game", async ({ code }) => {
        try {
            if (!userId) {
                socket.emit("error", { message: "Authentication required" });
                return;
            }

            const session = await getGameSession(code, GameModel, io, getSocket);
            const gameResponse = await session.joinGame(userId);
            
            socket.join(code);
            
            const room = await io.in(code).fetchSockets();
            const usersInRoom = room.map(s => s.id).filter(id => id !== socket.id);
            socket.emit("existing-users", { usersInRoom });
            
            socket.emit("socket:join-game:success", { game: gameResponse });
        } catch (error) {
            console.log("Error in socket:join-game", error.message);
            socket.emit("error", { message: error.message });
        }
    });

    socket.on("socket:start-game", async ({ code }) => {
        try {
            if (!userId) {
                socket.emit("error", { message: "Authentication required" });
                return;
            }

            const session = await getGameSession(code, GameModel, io, getSocket);
            if (session.state.hostId.toString() !== userId.toString()) {
                socket.to(code).emit("error", { message: "Only host can start game" });
                return;
            }

            const result = await session.startGame();
            
            socket.to(code).emit("socket:start-game:success", { game: result.game });
        } catch (error) {
            console.log("Error in socket:start-game", error.message);
            socket.to(code).emit("error", { message: error.message });
        }
    });

    socket.on("socket:roll-dice", async ({ code }) => {
        try {
            if (!userId) {
                socket.emit("error", { message: "Authentication required" });
                return;
            }

            // Use new GameSession architecture for rollDice
            const session = await getGameSession(code, GameModel, io, getSocket);
            const result = await session.rollDice(userId);
            
            socket.emit("socket:roll-dice:success", result);
        } catch (error) {
            console.log("Error in socket:roll-dice", error.message);
            socket.emit("error", { message: error.message });
        }
    });

    socket.on("socket:end-turn", async ({ code }) => {
        try {
            if (!userId) {
                socket.emit("error", { message: "Authentication required" });
                return;
            }

            // Use new GameSession architecture for endTurn
            const session = await getGameSession(code, GameModel, io, getSocket);
            const result = await session.endTurn(userId);
            
            socket.emit("socket:end-turn:success", { game: result });
        } catch (error) {
            console.log("Error in socket:end-turn", error.message);
            socket.emit("error", { message: error.message });
        }
    });

    socket.on("socket:buy-prop", async ({ code }) => {
        try {
            if (!userId) {
                socket.emit("error", { message: "Authentication required" });
                return;
            }

            const session = await getGameSession(code, GameModel, io, getSocket);
            const result = await session.buyProperty(userId);
            
            socket.emit("socket:buy-prop:success", result);
        } catch (error) {
            console.log("Error in socket:buy-prop", error.message);
            socket.emit("error", { message: error.message });
        }
    });

    socket.on("socket:pay-rent", async ({ code, recipient, space }) => {
        try {
            if (!userId) {
                socket.emit("error", { message: "Authentication required" });
                return;
            }

            const session = await getGameSession(code, GameModel, io, getSocket);
            const result = await session.payRent(userId, recipient, space);
            
            socket.emit("socket:pay-rent:success", result);
        } catch (error) {
            console.log("Error in socket:pay-rent", error.message);
            socket.emit("error", { message: error.message });
        }
    });

    socket.on("socket:offer-trade", async ({ code, tradeOffer }) => {
        try {
            if (!userId) {
                socket.emit("error", { message: "Authentication required" });
                return;
            }

            const session = await getGameSession(code, GameModel, io, getSocket);
            const result = await session.offerTrade(userId, tradeOffer);
            
            socket.emit("socket:offer-trade:success", result);
        } catch (error) {
            console.log("Error in socket:offer-trade", error.message);
            socket.emit("error", { message: error.message });
        }
    });

    socket.on("socket:accept-trade", async ({ code, tradeOffer }) => {
        try {
            if (!userId) {
                socket.emit("error", { message: "Authentication required" });
                return;
            }

            const session = await getGameSession(code, GameModel, io, getSocket);
            const result = await session.acceptTrade(userId, tradeOffer);
            
            socket.emit("socket:accept-trade:success", result);
        } catch (error) {
            console.log("Error in socket:accept-trade", error.message);
            socket.emit("error", { message: error.message });
        }
    });

    socket.on("socket:reject-trade", async ({ code, tradeOffer }) => {
        try {
            if (!userId) {
                socket.emit("error", { message: "Authentication required" });
                return;
            }

            const session = await getGameSession(code, GameModel, io, getSocket);
            const result = await session.rejectTrade(userId, tradeOffer);
            
            socket.emit("socket:reject-trade:success", result);
        } catch (error) {
            console.log("Error in socket:reject-trade", error.message);
            socket.emit("error", { message: error.message });
        }
    });

    socket.on("socket:build-house", async ({ code, propertyIdx }) => {
        try {
            if (!userId) {
                socket.emit("error", { message: "Authentication required" });
                return;
            }

            const session = await getGameSession(code, GameModel, io, getSocket);
            const result = await session.buildHouse(userId, propertyIdx);
            
            socket.emit("socket:build-house:success", result);
        } catch (error) {
            console.log("Error in socket:build-house", error.message);
            socket.emit("error", { message: error.message });
        }
    });

    socket.on("socket:mortgage-prop", async ({ code, propertyIdx }) => {
        try {
            if (!userId) {
                socket.emit("error", { message: "Authentication required" });
                return;
            }

            const session = await getGameSession(code, GameModel, io, getSocket);
            const result = await session.mortgageProperty(userId, propertyIdx);
            
            socket.emit("socket:mortgage-prop:success", result);
        } catch (error) {
            console.log("Error in socket:mortgage-prop", error.message);
            socket.emit("error", { message: error.message });
        }
    });

    socket.on("socket:unmortgage-prop", async ({ code, propertyIdx }) => {
        try {
            if (!userId) {
                socket.emit("error", { message: "Authentication required" });
                return;
            }

            const session = await getGameSession(code, GameModel, io, getSocket);
            const result = await session.unmortgageProperty(userId, propertyIdx);
            
            socket.emit("socket:unmortgage-prop:success", result);
        } catch (error) {
            console.log("Error in socket:unmortgage-prop", error.message);
            socket.emit("error", { message: error.message });
        }
    });

    socket.on("socket:sell-house", async ({ code, propertyIdx }) => {
        try {
            if (!userId) {
                socket.emit("error", { message: "Authentication required" });
                return;
            }

            const session = await getGameSession(code, GameModel, io, getSocket);
            const result = await session.sellHouse(userId, propertyIdx);
            
            socket.emit("socket:sell-house:success", result);
        } catch (error) {
            console.log("Error in socket:sell-house", error.message);
            socket.emit("error", { message: error.message });
        }
    });

    socket.on("socket:get-loan", async ({ code, loanAmt }) => {
        try {
            if (!userId) {
                socket.emit("error", { message: "Authentication required" });
                return;
            }

            const session = await getGameSession(code, GameModel, io, getSocket);
            const result = await session.getLoan(userId, loanAmt);
            
            socket.emit("socket:get-loan:success", result);
        } catch (error) {
            console.log("Error in socket:get-loan", error.message);
            socket.emit("error", { message: error.message });
        }
    });

    socket.on("socket:end-game", async ({ code }) => {
        try {
            if (!userId) {
                socket.emit("error", { message: "Authentication required" });
                return;
            }

            // Use new GameSession architecture for endGame
            const session = await getGameSession(code, GameModel, io, getSocket);
            const result = await session.endGame();
            
            socket.emit("socket:end-game:success", { game: result });
            io.to(code).emit("game-ended", { game: result });
        } catch (error) {
            console.log("Error in socket:end-game", error.message);
            socket.emit("error", { message: error.message });
        }
    });

    // if (socket.recovered) {
    //     console.log("recovered");
    // };
    socket.on("disconnect", () => {
        console.log("a user disconnected", socket.id);
    });
});
export { io, app, server };