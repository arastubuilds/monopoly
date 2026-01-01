import GameModel from "../models/game.model.js";
import { getSocket, io } from "../lib/socket.js";
import { chanceCards, communityCards } from "./data.js";

// In-memory cache for active Game instances
const activeGames = new Map();

// Get or load a Game instance
export async function getGameInstance(code, populateFields = "players.userId") {
    // Always reload from database to ensure we have the latest data
    // This ensures consistency between REST API and socket events
    const gameDoc = await GameModel.findOne({ code }).populate(populateFields);
    if (!gameDoc) {
        throw new Error("Game not found");
    }
    
    // Update or create the cached instance
    if (activeGames.has(code)) {
        const gameInstance = activeGames.get(code);
        // Update the wrapped document with fresh data
        gameInstance.gameDoc = gameDoc;
        // Update references
        gameInstance.players = gameDoc.players;
        gameInstance.currentTurn = gameDoc.currentTurn;
        gameInstance.boardState = gameDoc.boardState;
        gameInstance.turnOrder = gameDoc.turnOrder || [];
        gameInstance.started = gameDoc.started || false;
        gameInstance.winner = gameDoc.winner || null;
        return gameInstance;
    }
    
    const gameInstance = new Game(gameDoc);
    activeGames.set(code, gameInstance);
    return gameInstance;
}

// Remove game from cache (useful for cleanup)
export function removeGameInstance(code) {
    activeGames.delete(code);
}

// Clear all games (useful for testing)
export function clearGameCache() {
    activeGames.clear();
}

export default class Game {
    constructor(gameDoc) {
        // Wrap the mongoose document (keep original for syncing)
        this.gameDoc = gameDoc;
        // Work with instance properties (these are references, but we'll sync them back)
        this.code = gameDoc.code;
        this.hostId = gameDoc.hostId;
        this.currentTurn = gameDoc.currentTurn;
        this.boardState = gameDoc.boardState; // Reference to the same array
        this.players = gameDoc.players; // Reference to the same array
        this.turnOrder = [...(gameDoc.turnOrder || [])]; // Copy array
        this.started = gameDoc.started || false;
        this.winner = gameDoc.winner || null;
        this.idToIndexMap = {};
        if (this.started && this.players.length > 0) {
            this.players.forEach((p, index) => {
                this.idToIndexMap[p.userId._id.toString()] = index;
            });
        }
    }

    // Sync instance properties to gameDoc (without saving)
    syncToDoc() {
        // Sync arrays and objects - since they're references, we need to update the gameDoc's arrays
        this.gameDoc.turnOrder = [...this.turnOrder];
        this.gameDoc.currentTurn = this.currentTurn;
        this.gameDoc.started = this.started;
        this.gameDoc.winner = this.winner;
        // players and boardState are already references, so changes to this.players and this.boardState
        // are already reflected in this.gameDoc.players and this.gameDoc.boardState
        // But we need to mark them as modified for Mongoose
        this.gameDoc.markModified('players');
        this.gameDoc.markModified('boardState');
    }

    // Populate game document with related data (needed for socket events)
    // Accepts: string, array of strings, or mongoose populate options
    async populate(...args) {
        if (args.length === 1 && Array.isArray(args[0])) {
            // If single array argument, populate each field
            for (const field of args[0]) {
                await this.gameDoc.populate(field);
            }
        } else {
            // Pass through to mongoose populate (handles string, object, array, etc.)
            await this.gameDoc.populate(...args);
        }
        // Update references after population (since they're references, they should already be updated)
        // But we update them explicitly to be safe
        this.players = this.gameDoc.players;
        this.currentTurn = this.gameDoc.currentTurn;
        this.boardState = this.gameDoc.boardState;
        return this.gameDoc;
    }

    // Get the mongoose document (no syncing - returns current gameDoc state)
    getDoc() {
        return this.gameDoc;
    }

    // Handle landing on a space (works with Game instance)
    handleLandedOn(playerIndex, userId) {
        const player = this.players[playerIndex];
        const space = this.boardState[player.position];
        console.log("landed on", space.name);
        
        if (space.tax) {
            player.money -= space.amt;
            return {event: "landed-tax", space: space};
        }
        if (space.property || space.station || space.utility){
            if (!space.owned) return { event: "landed-unowned-prop", space: space };
            else if (space.owner && space.owner._id && space.owner._id.toString() === userId.toString()) {
                const canBuildHouse = this.checkBuildHouse(player, space);
                console.log("can build a house");
                return {event: "landed-your-prop", space: space, canBuildHouse};
            } else {
                return { event:"landed-owned-prop", space: space };
            }
        }
        if (space.chance){
            const card = this.drawRandomCard(chanceCards);
            if (card.destination){
                this.movePlayerTo(player, card.destination);
            }else if (card.amt){
                player.money += card.amt;
            }
            return {event: "landed-chance", card}
        }
        if (space.comm){
            const card = this.drawRandomCard(communityCards);
            player.money += card.amt;
            return {event: "landed-community", card};
        }
    }

    checkBuildHouse(player, property) {
        if (property.property && property.houses <= 4) 
            return player.properties.every(p => property.setPairIndices.includes(p));
        else return false;
    }

    drawRandomCard(cardArray) {
        const card = cardArray[Math.floor(Math.random()*cardArray.length)];
        return card;
    }

    movePlayerTo(player, destination) {
        if (player.position > destination && destination != 10){
            player.money += 2000;
        }   
        player.position = destination;
    }

    // End game: sync instance state to gameDoc and save to database
    async endGame() {
        this.syncToDoc();
        await this.gameDoc.save();
        return this.gameDoc;
    }

    async join(userId) {
        const playerExists = this.players.some(player => player.userId.toString() === userId.toString());
        if (playerExists) throw new Error("Player already joined");
        if (this.players.length >= 6) throw new Error("Room is Full");
        
        this.players.push({ userId });
        await this.populate("players.userId");
        
        return this.getDoc();
    }

    async start() {
        if (this.players.length < 2) throw new Error("2 or more players required");
        
        this.idToIndexMap = {};
        this.players.forEach((p, index) => {
            this.idToIndexMap[p.userId._id.toString()] = index;
        });
        
        this.turnOrder = this.players.map(player => player.userId._id.toString());
        this.turnOrder.sort(() => Math.random() - 0.5);
        this.currentTurn = this.turnOrder[0];
        this.started = true;

        await this.populate("currentTurn");
        
        return { game: this.getDoc(), idToIndexMap: this.idToIndexMap };
    }

    async rollDice(userId) {
        if (this.currentTurn.toString() !== userId.toString()) throw new Error("Not Your Turn");
        
        const playerIndex = this.players.findIndex(
            (p) => p.userId._id.toString() === userId.toString()
        );
        if (playerIndex === -1) throw new Error("Player not found");

        const die1 = Math.ceil(Math.random() * 6);
        const die2 = Math.ceil(Math.random() * 6);
        const roll = die1 + die2;

        let newPosition = (this.players[playerIndex].position + roll) % 40;

        if (newPosition < this.players[playerIndex].position) {
            this.players[playerIndex].money += 2000; // Add $2000 for passing GO
        }

        this.players[playerIndex].position = newPosition;
        
        // Populate boardState.owner if needed (for socket events that show owner info)
        await this.populate("boardState.owner");
        
        // Use instance method to handle landing
        const landed = this.handleLandedOn(playerIndex, userId);
        
        const name = this.players[playerIndex].userId;
        const socket = getSocket(userId);
        
        socket.to(this.code).emit("dice-rolled", {
            game: this.getDoc(),
            num: roll,
            name: name,
            index: playerIndex,
            space: landed.space
        });

        if (landed.event === "landed-unowned-prop") {
            socket.to(this.code).emit(landed.event, { space: landed.space });
            return {
                message: `You rolled a ${roll}\nLanded on ${landed.space.name}`,
                buy: true,
                pay: false,
                own: false,
                yourIndex: playerIndex,
                landedOn: landed.space,
                game: this.getDoc(),
                dice: { die1, die2 },
                number: roll,
            };
        } else if (landed.event === "landed-owned-prop") {
            socket.to(this.code).emit(landed.event, { space: landed.space });
            return {
                message: `You rolled a ${roll} Landed on ${landed.space.name} owned by ${landed.space.owner.username}. Rent owed is ${landed.space.base}`,
                buy: false,
                pay: true,
                own: false,
                yourIndex: playerIndex,
                landedOn: landed.space,
                game: this.getDoc(),
                dice: { die1, die2 },
                number: roll,
            };
        } else if (landed.event === "landed-your-prop") {
            socket.to(this.code).emit(landed.event, { space: landed.space });
            return {
                message: `You rolled a ${roll} Landed on your own ${landed.space.name}`,
                buy: false,
                pay: false,
                own: true,
                yourIndex: playerIndex,
                landedOn: landed.space,
                game: this.getDoc(),
                dice: { die1, die2 },
                number: roll,
            };
        } else {
            return {
                message: `You rolled a ${roll}`,
                buy: false,
                pay: false,
                own: false,
                yourIndex: playerIndex,
                landedOn: landed.space,
                game: this.getDoc(),
                dice: { die1, die2 },
                number: roll,
            };
        }
    }

    async endTurn(userId) {
        const currentIndex = this.turnOrder.findIndex(
            (id) => id.toString() === userId.toString()
        );
        if (currentIndex === -1) throw new Error("Player not found in turn order");
        
        const curr = this.players[currentIndex];
        const socket = getSocket(userId);
        socket.to(this.code).emit("end-turn", curr.userId);

        const nextIndex = (currentIndex + 1) % this.players.length;
        this.currentTurn = this.turnOrder[nextIndex];

        await this.populate(["players.userId", "currentTurn"]);
        
        io.to(this.code).emit("player-turn", {
            currentTurn: this.currentTurn,
            game: this.getDoc()
        });

        return this.getDoc();
    }

    async buyProp(userId) {
        const playerIndex = this.players.findIndex(
            (p) => p.userId._id.toString() === userId.toString()
        );
        if (playerIndex === -1) throw new Error("Player not found");
        
        const player = this.players[playerIndex];
        const property = this.boardState[player.position];

        if (player.money < property.price) throw new Error("Insufficient Balance");

        player.money -= property.price;
        player.properties.push(player.position);
        property.owned = true;
        property.owner = userId;

        await this.populate(["currentTurn", "players.userId", "boardState.owner"]);

        const updatedGame = this.getDoc();
        const updatedPlayerIndex = updatedGame.players.findIndex(
            (p) => p.userId._id.toString() === userId.toString()
        );
        const updatedPlayer = updatedGame.players[updatedPlayerIndex];

        const yourProperties = updatedGame.boardState.filter((prop) => {
            return updatedPlayer.properties.includes(prop.id);
        });

        const otherPlayersProperties = [];
        updatedGame.players.forEach((p) => {
            const props = updatedGame.boardState.filter((prop) => {
                return p.properties.includes(prop.id);
            });
            otherPlayersProperties.push({ player: p, properties: props });
        });

        const yourMoney = updatedGame.players[updatedPlayerIndex].money;
        const socket = getSocket(userId);
        socket.to(this.code).emit("property-bought", {
            player: updatedPlayer.userId.username,
            property: property.name,
            game: updatedGame,
            otherPlayersProperties: otherPlayersProperties
        });

        return {
            game: updatedGame,
            yourProperties: yourProperties,
            yourMoney: yourMoney
        };
    }

    async payRent(userId, recipient, space) {
        const playerIndex = this.players.findIndex(
            (player) => player.userId._id.toString() === userId.toString()
        );
        const receiverIndex = this.players.findIndex(
            (player) => player.userId._id.toString() === recipient._id.toString()
        );

        if (playerIndex === -1 || receiverIndex === -1) throw new Error("Player not found");

        this.players[playerIndex].money -= space.base;
        this.players[receiverIndex].money += space.base;

        await this.populate(["players.userId", "boardState.owner"]);

        const updatedGame = this.getDoc();
        const player = updatedGame.players[playerIndex];
        const receiver = updatedGame.players[receiverIndex];

        const playerMoney = updatedGame.players[playerIndex].money;
        const receiverMoney = updatedGame.players[receiverIndex].money;

        const otherPlayersProperties = [];
        updatedGame.players.forEach((p) => {
            const props = updatedGame.boardState.filter((prop) => {
                return p.properties.includes(prop.id);
            });
            otherPlayersProperties.push({ player: p, properties: props });
        });

        const socket = getSocket(userId);
        socket.to(this.code).emit("paid-rent", {
            player: player,
            reciever: receiver,
            space: space,
            game: updatedGame,
            yourMoney: receiverMoney,
            otherPlayersProperties
        });

        const oPP = otherPlayersProperties.filter(
            (opp) => opp.player.userId._id.toString() !== userId.toString()
        );

        return {
            game: updatedGame,
            yourMoney: playerMoney,
            otherPlayersProperties: oPP
        };
    }

    async offerTrade(userId, tradeOffer) {
        await this.populate(["players.userId", "boardState.owner"]);
        
        const playerIndex = this.players.findIndex(
            (player) => player.userId._id.toString() === userId.toString()
        );
        const receiverIndex = this.players.findIndex(
            (player) => player.userId._id.toString() === tradeOffer.recipient.player.userId._id.toString()
        );

        if (playerIndex === -1 || receiverIndex === -1) throw new Error("Player not found");

        const player = this.players[playerIndex];
        const receiver = this.players[receiverIndex];

        const senderSocket = getSocket(userId);
        senderSocket.to(this.code).emit("trade-offer", { player, receiver, tradeOffer });

        return { message: "Trade Offered" };
    }

    async acceptOffer(userId, tradeOffer) {
        await this.populate(["players.userId"]);
        
        const senderIndex = this.players.findIndex(
            (player) => player.userId._id.toString() === tradeOffer.sender._id.toString()
        );
        const receiverIndex = this.players.findIndex(
            (player) => player.userId._id.toString() === userId.toString()
        );

        if (senderIndex === -1 || receiverIndex === -1) throw new Error("Player not found");

        const sender = this.players[senderIndex];
        const receiver = this.players[receiverIndex];

        // Remove properties being traded away
        sender.properties = sender.properties.filter((prop) => {
            return !tradeOffer.senderOffer.senderProp.map(p => p.id).includes(prop);
        });
        receiver.properties = receiver.properties.filter((prop) => {
            return !tradeOffer.senderAsk.askedProp.map(p => p.id).includes(prop);
        });

        // Add properties being received
        sender.properties.push(...tradeOffer.senderAsk.askedProp.map(p => p.id));
        receiver.properties.push(...tradeOffer.senderOffer.senderProp.map(p => p.id));

        // Update board state ownership
        sender.properties.forEach((p) => {
            this.boardState[p].owner = sender.userId._id;
        });
        receiver.properties.forEach((p) => {
            this.boardState[p].owner = receiver.userId._id;
        });

        // Update money
        sender.money -= tradeOffer.senderOffer.senderMoney;
        sender.money += tradeOffer.senderAsk.askedMoney;
        receiver.money -= tradeOffer.senderAsk.askedMoney;
        receiver.money += tradeOffer.senderOffer.senderMoney;

        await this.populate(["players.userId", "boardState.owner"]);

        const updatedGame = this.getDoc();
        const updatedSender = updatedGame.players[senderIndex];
        const updatedReceiver = updatedGame.players[receiverIndex];

        const yourMoney = updatedReceiver.money;
        const yourProperties = updatedGame.boardState.filter((prop) => {
            return updatedReceiver.properties.includes(prop.id);
        });
        const senderProperties = updatedGame.boardState.filter((prop) => {
            return updatedSender.properties.includes(prop.id);
        });

        const otherPlayersProperties = [];
        updatedGame.players.forEach((p) => {
            const props = updatedGame.boardState.filter((prop) => {
                return p.properties.includes(prop.id);
            });
            otherPlayersProperties.push({ player: p, properties: props });
        });

        const socket = getSocket(userId);
        socket.to(this.code).emit("trade-accepted", {
            game: updatedGame,
            sender: updatedSender,
            senderProperties: senderProperties,
            otherPlayersProperties
        });

        return {
            game: updatedGame,
            yourMoney,
            yourProperties,
            otherPlayersProperties
        };
    }

    async rejectOffer(userId, tradeOffer) {
        const socket = getSocket(userId);
        socket.to(this.code).emit("trade-rejected", { tradeOffer });
        return { message: "Trade rejected", tradeOffer };
    }

    async buildHouse(userId, propertyIdx) {
        await this.populate(["players.userId", "boardState.owner"]);
        
        const playerIndex = this.players.findIndex(
            (player) => player.userId._id.toString() === userId.toString()
        );
        if (playerIndex === -1) throw new Error("Player not found");

        const player = this.players[playerIndex];
        const property = this.boardState[propertyIdx];

        const flag = player.properties.every(p => property.setPairIndices.includes(p));
        if (flag && property.houses <= 4) {
            property.houses += 1;
            player.money -= property.hCost;
        } else {
            throw new Error("Cannot build more houses");
        }
        
        return { message: "House Built Successfully" };
    }

    async mortgageProp(userId, propertyIdx) {
        await this.populate(["players.userId", "boardState.owner"]);
        
        const playerIndex = this.players.findIndex(
            (p) => p.userId._id.toString() === userId.toString()
        );
        if (playerIndex === -1) throw new Error("Player not found");

        const player = this.players[playerIndex];
        if (!player.properties.includes(propertyIdx)) {
            throw new Error("Not the property owner");
        }

        const property = this.boardState[propertyIdx];
        property.mortgaged = true;

        await this.populate(["players.userId", "boardState.owner"]);

        const socket = getSocket(userId);
        socket.to(this.code).emit("mortgaged-prop", { game: this.getDoc() });

        return { game: this.getDoc(), property };
    }

    async unmortgageProp(userId, propertyIdx) {
        await this.populate(["players.userId", "boardState.owner"]);
        
        const playerIndex = this.players.findIndex(
            (p) => p.userId._id.toString() === userId.toString()
        );
        if (playerIndex === -1) throw new Error("Player not found");

        const player = this.players[playerIndex];
        if (!player.properties.includes(propertyIdx) || !this.boardState[propertyIdx].mortgaged) {
            throw new Error("Either not the property owner or property is not mortgaged");
        }

        const property = this.boardState[propertyIdx];
        player.money -= (property.price / 2 + property.price / 20);
        property.mortgaged = false;

        await this.populate(["players.userId", "boardState.owner"]);

        const socket = getSocket(userId);
        socket.to(this.code).emit("unmortgaged-prop", { game: this.getDoc() });

        return { game: this.getDoc() };
    }

    async sellHouse(userId, propertyIdx) {
        const playerIndex = this.players.findIndex(
            (p) => p.userId._id.toString() === userId.toString()
        );
        if (playerIndex === -1) throw new Error("Player not found");

        const player = this.players[playerIndex];
        const property = this.boardState[propertyIdx];
        
        if (property.houses <= 0) throw new Error("No houses to sell");
        
        property.houses -= 1;
        player.money += property.hCost / 2;

        await this.populate(["players.userId", "boardState.owner"]);

        const socket = getSocket(userId);
        socket.to(this.code).emit("sold-house", { game: this.getDoc() });

        return { game: this.getDoc() };
    }

    async getLoan(userId, loanAmt) {
        const playerIndex = this.players.findIndex(
            (p) => p.userId._id.toString() === userId.toString()
        );
        if (playerIndex === -1) throw new Error("Player not found");

        const player = this.players[playerIndex];
        player.money += loanAmt;
        player.loanTaken = true;
        player.loanInterest = 10;

        return { game: this.getDoc() };
    }
}
