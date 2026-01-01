import { chanceCards, communityCards } from "./data.js";

/**
 * Pure GameState - Plain JavaScript object with no Mongoose dependencies
 */
export class GameState {
    constructor(data) {
        this.code = data.code;
        this.hostId = data.hostId?.toString?.() || data.hostId;
        this.currentTurn = data.currentTurn?.toString?.() || data.currentTurn;
        this.started = data.started || false;
        this.winner = data.winner?.toString?.() || data.winner || null;
        
        // Deep clone players array - store userId as string
        this.players = (data.players || []).map(p => ({
            userId: p.userId?._id?.toString() || p.userId?.toString() || p.userId,
            position: p.position || 0,
            money: p.money || 15000,
            properties: [...(p.properties || [])],
            inJail: p.inJail || false,
            jailTurns: p.jailTurns || 0,
            loanTaken: p.loanTaken || false,
            loanInterest: p.loanInterest || 0,
        }));
        
        // Deep clone boardState - store ownerId as string (not populated object)
        this.boardState = (data.boardState || []).map(space => ({
            id: space.id,
            name: space.name,
            color: space.color,
            price: space.price,
            base: space.base,
            hCost: space.hCost,
            setSize: space.setSize,
            setPairIndices: [...(space.setPairIndices || [])],
            go: space.go || false,
            property: space.property || false,
            station: space.station || false,
            utility: space.utility || false,
            tax: space.tax || false,
            jail: space.jail || false,
            free: space.free || false,
            chance: space.chance || false,
            comm: space.comm || false,
            owned: space.owned || false,
            ownerId: space.owner?._id?.toString() || space.owner?.toString() || space.owner || null,
            houses: space.houses || 0,
            hotels: space.hotels || 0,
            gridRow: space.gridRow,
            gridColumn: space.gridColumn,
            mortgaged: space.mortgaged || false,
            amt: space.amt, // for tax spaces
        }));
        
        // Turn order as array of player IDs (strings)
        this.turnOrder = (data.turnOrder || []).map(id => id?.toString?.() || id);
    }
    
    // Get player by userId
    getPlayer(userId) {
        const id = userId?.toString?.() || userId;
        return this.players.find(p => p.userId === id);
    }
    
    // Get player index by userId
    getPlayerIndex(userId) {
        const id = userId?.toString?.() || userId;
        return this.players.findIndex(p => p.userId === id);
    }
    
    // Get space by position
    getSpace(position) {
        return this.boardState[position];
    }
    
    // Clone the state (for immutability if needed)
    clone() {
        return new GameState(this);
    }
}

/**
 * Pure GameEngine - Contains only game rules and state mutations
 * No async, no sockets, no database
 */
export class GameEngine {
    constructor(state) {
        this.state = state;
    }
    
    /**
     * Roll dice and move player
     * Returns: { die1, die2, roll, newPosition, passedGo }
     */
    rollDice(playerId) {
        const player = this.state.getPlayer(playerId);
        if (!player) {
            throw new Error("Player not found");
        }
        
        if (this.state.currentTurn !== (playerId?.toString?.() || playerId)) {
            throw new Error("Not Your Turn");
        }
        
        const die1 = Math.ceil(Math.random() * 6);
        const die2 = Math.ceil(Math.random() * 6);
        const roll = die1 + die2;
        
        const oldPosition = player.position;
        const newPosition = (player.position + roll) % 40;
        const passedGo = newPosition < oldPosition;
        
        // Update player position
        player.position = newPosition;
        
        // Add money for passing GO
        if (passedGo) {
            player.money += 2000;
        }
        
        return { die1, die2, roll, newPosition, passedGo };
    }
    
    /**
     * Handle landing on a space
     * Returns: { event, space, card?, canBuildHouse? }
     */
    handleLanding(playerId) {
        const player = this.state.getPlayer(playerId);
        if (!player) {
            throw new Error("Player not found");
        }
        
        const space = this.state.getSpace(player.position);
        if (!space) {
            throw new Error("Invalid space position");
        }
        
        console.log("landed on", space.name);
        
        // Handle tax
        if (space.tax) {
            const taxAmount = space.amt || 0;
            player.money -= taxAmount;
            return { event: "landed-tax", space: { ...space }, taxAmount };
        }
        
        // Handle properties/stations/utilities
        if (space.property || space.station || space.utility) {
            if (!space.owned) {
                return { event: "landed-unowned-prop", space: { ...space } };
            }
            
            const playerIdStr = playerId?.toString?.() || playerId;
            const ownerIdStr = space.ownerId?.toString?.() || space.ownerId;
            
            if (ownerIdStr === playerIdStr) {
                const canBuildHouse = this.canBuildHouse(player, space);
                return { 
                    event: "landed-your-prop", 
                    space: { ...space },
                    canBuildHouse 
                };
            } else {
                return { event: "landed-owned-prop", space: { ...space } };
            }
        }
        
        // Handle chance
        if (space.chance) {
            const card = this.drawRandomCard(chanceCards);
            if (card.destination !== undefined) {
                this.movePlayerTo(player, card.destination);
            }
            if (card.amt !== undefined) {
                player.money += card.amt;
            }
            return { event: "landed-chance", space: { ...space }, card };
        }
        
        // Handle community chest
        if (space.comm) {
            const card = this.drawRandomCard(communityCards);
            if (card.amt !== undefined) {
                player.money += card.amt;
            }
            return { event: "landed-community", space: { ...space }, card };
        }
        
        // Default: landed on non-action space (GO, free parking, etc.)
        return { event: "landed-safe", space: { ...space } };
    }
    
    /**
     * End current player's turn
     * Returns: { nextTurn }
     */
    endTurn(playerId) {
        const currentTurnStr = playerId?.toString?.() || playerId;
        if (this.state.currentTurn !== currentTurnStr) {
            throw new Error("Not your turn");
        }
        
        const currentIndex = this.state.turnOrder.indexOf(currentTurnStr);
        if (currentIndex === -1) {
            throw new Error("Player not found in turn order");
        }
        
        const nextIndex = (currentIndex + 1) % this.state.turnOrder.length;
        const nextTurn = this.state.turnOrder[nextIndex];
        this.state.currentTurn = nextTurn;
        
        return { nextTurn };
    }
    
    // Helper methods
    canBuildHouse(player, property) {
        if (!property.property || property.houses >= 4) {
            return false;
        }
        return property.setPairIndices.every(propId => 
            player.properties.includes(propId)
        );
    }
    
    drawRandomCard(cardArray) {
        const index = Math.floor(Math.random() * cardArray.length);
        return { ...cardArray[index] };
    }
    
    movePlayerTo(player, destination) {
        if (player.position > destination && destination !== 10) {
            player.money += 2000; // Passed GO
        }
        player.position = destination;
    }
    
    /**
     * Buy property at player's current position
     * Returns: { property }
     */
    buyProperty(playerId) {
        const player = this.state.getPlayer(playerId);
        if (!player) {
            throw new Error("Player not found");
        }
        
        const property = this.state.getSpace(player.position);
        if (!property) {
            throw new Error("Invalid property position");
        }
        
        if (player.money < property.price) {
            throw new Error("Insufficient Balance");
        }
        
        if (property.owned) {
            throw new Error("Property already owned");
        }
        
        player.money -= property.price;
        player.properties.push(property.id);
        property.owned = true;
        property.ownerId = playerId?.toString?.() || playerId;
        
        return { property: { ...property } };
    }
    
    /**
     * Pay rent for landing on owned property
     * Returns: { rentAmount }
     */
    payRent(playerId, recipientId, rentAmount) {
        const player = this.state.getPlayer(playerId);
        const recipient = this.state.getPlayer(recipientId);
        
        if (!player || !recipient) {
            throw new Error("Player not found");
        }
        
        if (player.money < rentAmount) {
            throw new Error("Insufficient funds to pay rent");
        }
        
        player.money -= rentAmount;
        recipient.money += rentAmount;
        
        return { rentAmount };
    }
    
    /**
     * Execute trade between two players
     * Returns: { senderProperties, receiverProperties }
     */
    executeTrade(senderId, receiverId, tradeOffer) {
        const sender = this.state.getPlayer(senderId);
        const receiver = this.state.getPlayer(receiverId);
        
        if (!sender || !receiver) {
            throw new Error("Player not found");
        }
        
        // Extract property IDs from trade offer
        const senderPropIds = tradeOffer.senderOffer.senderProp.map(p => p.id);
        const receiverPropIds = tradeOffer.senderAsk.askedProp.map(p => p.id);
        
        // Validate players own the properties they're trading
        const senderOwnsAll = senderPropIds.every(id => sender.properties.includes(id));
        const receiverOwnsAll = receiverPropIds.every(id => receiver.properties.includes(id));
        
        if (!senderOwnsAll || !receiverOwnsAll) {
            throw new Error("Player does not own all properties in trade");
        }
        
        // Remove properties being traded away
        sender.properties = sender.properties.filter(id => !senderPropIds.includes(id));
        receiver.properties = receiver.properties.filter(id => !receiverPropIds.includes(id));
        
        // Add properties being received
        sender.properties.push(...receiverPropIds);
        receiver.properties.push(...senderPropIds);
        
        // Update board state ownership
        senderPropIds.forEach(propId => {
            const space = this.state.getSpace(propId);
            if (space) {
                space.ownerId = receiverId?.toString?.() || receiverId;
            }
        });
        
        receiverPropIds.forEach(propId => {
            const space = this.state.getSpace(propId);
            if (space) {
                space.ownerId = senderId?.toString?.() || senderId;
            }
        });
        
        // Update money
        sender.money -= tradeOffer.senderOffer.senderMoney;
        sender.money += tradeOffer.senderAsk.askedMoney;
        receiver.money -= tradeOffer.senderAsk.askedMoney;
        receiver.money += tradeOffer.senderOffer.senderMoney;
        
        return {
            senderProperties: [...sender.properties],
            receiverProperties: [...receiver.properties]
        };
    }
    
    /**
     * Build house on property
     * Returns: { property }
     */
    buildHouse(playerId, propertyIdx) {
        const player = this.state.getPlayer(playerId);
        if (!player) {
            throw new Error("Player not found");
        }
        
        const property = this.state.getSpace(propertyIdx);
        if (!property) {
            throw new Error("Invalid property");
        }
        
        if (!player.properties.includes(propertyIdx)) {
            throw new Error("Player does not own this property");
        }
        
        // Check if player owns all properties in the set
        const ownsFullSet = property.setPairIndices.every(propId => 
            player.properties.includes(propId)
        );
        
        if (!ownsFullSet) {
            throw new Error("Must own all properties in set to build houses");
        }
        
        if (property.houses >= 4) {
            throw new Error("Cannot build more houses (max 4)");
        }
        
        if (player.money < property.hCost) {
            throw new Error("Insufficient funds to build house");
        }
        
        property.houses += 1;
        player.money -= property.hCost;
        
        return { property: { ...property } };
    }
    
    /**
     * Mortgage a property
     * Returns: { property }
     */
    mortgageProperty(playerId, propertyIdx) {
        const player = this.state.getPlayer(playerId);
        if (!player) {
            throw new Error("Player not found");
        }
        
        const property = this.state.getSpace(propertyIdx);
        if (!property) {
            throw new Error("Invalid property");
        }
        
        if (!player.properties.includes(propertyIdx)) {
            throw new Error("Not the property owner");
        }
        
        if (property.mortgaged) {
            throw new Error("Property is already mortgaged");
        }
        
        property.mortgaged = true;
        
        return { property: { ...property } };
    }
    
    /**
     * Unmortgage a property
     * Returns: { property }
     */
    unmortgageProperty(playerId, propertyIdx) {
        const player = this.state.getPlayer(playerId);
        if (!player) {
            throw new Error("Player not found");
        }
        
        const property = this.state.getSpace(propertyIdx);
        if (!property) {
            throw new Error("Invalid property");
        }
        
        if (!player.properties.includes(propertyIdx)) {
            throw new Error("Not the property owner");
        }
        
        if (!property.mortgaged) {
            throw new Error("Property is not mortgaged");
        }
        
        const unmortgageCost = Math.floor(property.price / 2) + Math.floor(property.price / 20);
        
        if (player.money < unmortgageCost) {
            throw new Error("Insufficient funds to unmortgage");
        }
        
        property.mortgaged = false;
        player.money -= unmortgageCost;
        
        return { property: { ...property }, unmortgageCost };
    }
    
    /**
     * Sell a house from a property
     * Returns: { property, sellValue }
     */
    sellHouse(playerId, propertyIdx) {
        const player = this.state.getPlayer(playerId);
        if (!player) {
            throw new Error("Player not found");
        }
        
        const property = this.state.getSpace(propertyIdx);
        if (!property) {
            throw new Error("Invalid property");
        }
        
        if (!player.properties.includes(propertyIdx)) {
            throw new Error("Player does not own this property");
        }
        
        if (property.houses <= 0) {
            throw new Error("No houses to sell");
        }
        
        const sellValue = Math.floor(property.hCost / 2);
        property.houses -= 1;
        player.money += sellValue;
        
        return { property: { ...property }, sellValue };
    }
    
    /**
     * Take a loan
     * Returns: { loanAmount }
     */
    takeLoan(playerId, loanAmount) {
        const player = this.state.getPlayer(playerId);
        if (!player) {
            throw new Error("Player not found");
        }
        
        player.money += loanAmount;
        player.loanTaken = true;
        player.loanInterest = 10; // 10% interest
        
        return { loanAmount };
    }
    
    /**
     * Start the game
     * Returns: { turnOrder }
     */
    startGame() {
        if (this.state.players.length < 2) {
            throw new Error("2 or more players required");
        }
        
        if (this.state.started) {
            throw new Error("Game already started");
        }
        
        // Create turn order from player IDs
        this.state.turnOrder = this.state.players.map(p => p.userId);
        // Randomize turn order
        this.state.turnOrder.sort(() => Math.random() - 0.5);
        
        // Set current turn to first player
        this.state.currentTurn = this.state.turnOrder[0];
        this.state.started = true;
        
        return { turnOrder: [...this.state.turnOrder] };
    }
    
    /**
     * Join a player to the game
     * Returns: { playerId }
     */
    joinGame(playerId) {
        const id = playerId?.toString?.() || playerId;
        
        // Check if already joined
        if (this.state.players.some(p => p.userId === id)) {
            throw new Error("Player already joined");
        }
        
        if (this.state.players.length >= 6) {
            throw new Error("Room is Full");
        }
        
        if (this.state.started) {
            throw new Error("Cannot join game after it has started");
        }
        
        // Add new player
        this.state.players.push({
            userId: id,
            position: 0,
            money: 15000,
            properties: [],
            inJail: false,
            jailTurns: 0,
            loanTaken: false,
            loanInterest: 0,
        });
        
        return { playerId: id };
    }
}

/**
 * GameSession - Orchestrator that wraps GameEngine and handles:
 * - Socket emissions
 * - Database persistence
 * - Converting between pure state and Mongoose documents
 */
export class GameSession {
    constructor(code, gameDoc, io, getSocket) {
        this.code = code;
        this.gameDoc = gameDoc; // Keep reference for final save
        this.io = io;
        this.getSocket = getSocket;
        
        // Create pure game state from document
        this.state = new GameState({
            code: gameDoc.code,
            hostId: gameDoc.hostId,
            currentTurn: gameDoc.currentTurn,
            started: gameDoc.started,
            winner: gameDoc.winner,
            players: gameDoc.players,
            boardState: gameDoc.boardState,
            turnOrder: gameDoc.turnOrder || [],
        });
        
        // Create engine with pure state
        this.engine = new GameEngine(this.state);
    }
    
    /**
     * Get populated user object by userId (from original gameDoc)
     */
    getPopulatedUser(userId) {
        const id = userId?.toString?.() || userId;
        const player = this.gameDoc.players.find(p => 
            (p.userId?._id?.toString() || p.userId?.toString() || p.userId) === id
        );
        return player?.userId;
    }
    
    /**
     * Build space object for responses, merging state with original space data
     */
    buildSpaceResponse(spaceIdx) {
        const stateSpace = this.state.boardState[spaceIdx];
        const originalSpace = this.gameDoc.boardState[spaceIdx];
        const spaceObj = originalSpace?.toObject ? originalSpace.toObject() : { ...originalSpace };
        
        // Update with current state
        spaceObj.owned = stateSpace.owned;
        spaceObj.houses = stateSpace.houses;
        spaceObj.hotels = stateSpace.hotels;
        spaceObj.mortgaged = stateSpace.mortgaged;
        
        // Set owner from state (use original populated owner if available, otherwise use ownerId)
        if (stateSpace.ownerId) {
            const ownerUser = this.getPopulatedUser(stateSpace.ownerId);
            spaceObj.owner = ownerUser || stateSpace.ownerId;
        } else {
            spaceObj.owner = null;
        }
        
        return spaceObj;
    }
    
    /**
     * Build game response object combining state with original populated user data
     */
    buildGameResponse() {
        const response = {
            code: this.state.code,
            hostId: this.state.hostId,
            currentTurn: this.getPopulatedUser(this.state.currentTurn) || this.state.currentTurn,
            started: this.state.started,
            winner: this.state.winner ? (this.getPopulatedUser(this.state.winner) || this.state.winner) : null,
            turnOrder: this.state.turnOrder.map(id => this.getPopulatedUser(id) || id),
            players: this.state.players.map(statePlayer => {
                const originalPlayer = this.gameDoc.players.find(p => 
                    (p.userId?._id?.toString() || p.userId?.toString() || p.userId) === statePlayer.userId
                );
                return {
                    userId: originalPlayer?.userId || statePlayer.userId,
                    position: statePlayer.position,
                    money: statePlayer.money,
                    properties: [...statePlayer.properties],
                    inJail: statePlayer.inJail,
                    jailTurns: statePlayer.jailTurns,
                    loanTaken: statePlayer.loanTaken || false,
                    loanInterest: statePlayer.loanInterest || 0,
                };
            }),
            boardState: this.state.boardState.map((stateSpace, index) => 
                this.buildSpaceResponse(index)
            ),
        };
        return response;
    }
    
    /**
     * Sync pure state back to Mongoose document (only called at endGame)
     */
    syncToDocument() {
        // Sync primitive values - mongoose will auto-convert strings to ObjectIds
        this.gameDoc.currentTurn = this.state.currentTurn;
        this.gameDoc.started = this.state.started;
        this.gameDoc.winner = this.state.winner || null;
        this.gameDoc.turnOrder = [...this.state.turnOrder];
        
        // Sync players - update existing and add new ones
        this.state.players.forEach((statePlayer) => {
            // Find existing player by userId
            const existingPlayerIndex = this.gameDoc.players.findIndex(p => {
                const docUserId = p.userId?._id?.toString() || p.userId?.toString() || p.userId;
                return docUserId === statePlayer.userId;
            });
            
            if (existingPlayerIndex !== -1) {
                // Update existing player
                const docPlayer = this.gameDoc.players[existingPlayerIndex];
                docPlayer.position = statePlayer.position;
                docPlayer.money = statePlayer.money;
                docPlayer.properties = [...statePlayer.properties];
                docPlayer.inJail = statePlayer.inJail;
                docPlayer.jailTurns = statePlayer.jailTurns;
                docPlayer.loanTaken = statePlayer.loanTaken;
                docPlayer.loanInterest = statePlayer.loanInterest;
            } else {
                // Add new player (mongoose will convert string userId to ObjectId)
                this.gameDoc.players.push({
                    userId: statePlayer.userId,
                    position: statePlayer.position,
                    money: statePlayer.money,
                    properties: [...statePlayer.properties],
                    inJail: statePlayer.inJail,
                    jailTurns: statePlayer.jailTurns,
                    loanTaken: statePlayer.loanTaken,
                    loanInterest: statePlayer.loanInterest,
                });
            }
        });
        
        // Sync boardState (update ownerId back to owner - mongoose will convert string to ObjectId)
        this.state.boardState.forEach((stateSpace, index) => {
            if (this.gameDoc.boardState[index]) {
                const docSpace = this.gameDoc.boardState[index];
                docSpace.owned = stateSpace.owned;
                docSpace.owner = stateSpace.ownerId || null;
                docSpace.houses = stateSpace.houses;
                docSpace.hotels = stateSpace.hotels;
                docSpace.mortgaged = stateSpace.mortgaged;
            }
        });
        
        // Mark as modified for Mongoose
        this.gameDoc.markModified('players');
        this.gameDoc.markModified('boardState');
    }
    
    /**
     * Roll dice - orchestrates engine + socket events
     */
    async rollDice(userId) {
        // Use pure engine logic
        const rollResult = this.engine.rollDice(userId);
        const landingResult = this.engine.handleLanding(userId);
        
        // Get player index and player from state
        const playerIndex = this.state.getPlayerIndex(userId);
        const player = this.state.getPlayer(userId);
        
        if (playerIndex === -1 || !player) {
            throw new Error("Player not found");
        }
        
        // Build response objects from state
        const gameResponse = this.buildGameResponse();
        const populatedSpace = this.buildSpaceResponse(player.position);
        const playerUser = this.getPopulatedUser(userId);
        
        // Get socket for emitting
        const socket = this.getSocket(userId);
        
        // Emit dice rolled event
        socket.to(this.code).emit("dice-rolled", {
            game: gameResponse,
            num: rollResult.roll,
            name: playerUser,
            index: playerIndex,
            space: populatedSpace
        });
        
        // Handle different landing events
        if (landingResult.event === "landed-unowned-prop") {
            socket.to(this.code).emit(landingResult.event, { space: populatedSpace });
            return {
                message: `You rolled a ${rollResult.roll}\nLanded on ${populatedSpace.name}`,
                buy: true,
                pay: false,
                own: false,
                yourIndex: playerIndex,
                landedOn: populatedSpace,
                game: gameResponse,
                dice: { die1: rollResult.die1, die2: rollResult.die2 },
                number: rollResult.roll,
            };
        } else if (landingResult.event === "landed-owned-prop") {
            socket.to(this.code).emit(landingResult.event, { space: populatedSpace });
            return {
                message: `You rolled a ${rollResult.roll} Landed on ${populatedSpace.name} owned by ${populatedSpace.owner?.username}. Rent owed is ${populatedSpace.base}`,
                buy: false,
                pay: true,
                own: false,
                yourIndex: playerIndex,
                landedOn: populatedSpace,
                game: gameResponse,
                dice: { die1: rollResult.die1, die2: rollResult.die2 },
                number: rollResult.roll,
            };
        } else if (landingResult.event === "landed-your-prop") {
            socket.to(this.code).emit(landingResult.event, { space: populatedSpace });
            return {
                message: `You rolled a ${rollResult.roll} Landed on your own ${populatedSpace.name}`,
                buy: false,
                pay: false,
                own: true,
                yourIndex: playerIndex,
                landedOn: populatedSpace,
                game: gameResponse,
                dice: { die1: rollResult.die1, die2: rollResult.die2 },
                number: rollResult.roll,
            };
        } else {
            return {
                message: `You rolled a ${rollResult.roll}`,
                buy: false,
                pay: false,
                own: false,
                yourIndex: playerIndex,
                landedOn: populatedSpace,
                game: gameResponse,
                dice: { die1: rollResult.die1, die2: rollResult.die2 },
                number: rollResult.roll,
            };
        }
    }
    
    /**
     * End turn - orchestrates engine + socket events
     */
    async endTurn(userId) {
        const playerIndex = this.state.getPlayerIndex(userId);
        const player = this.state.getPlayer(userId);
        
        if (playerIndex === -1 || !player) {
            throw new Error("Player not found");
        }
        
        // Use pure engine logic
        const result = this.engine.endTurn(userId);
        
        // Build response from state
        const gameResponse = this.buildGameResponse();
        const playerUser = this.getPopulatedUser(userId);
        
        // Emit socket events
        const socket = this.getSocket(userId);
        socket.to(this.code).emit("end-turn", playerUser);
        
        this.io.to(this.code).emit("player-turn", {
            currentTurn: gameResponse.currentTurn,
            game: gameResponse
        });
        
        return gameResponse;
    }
    
    /**
     * Buy property - orchestrates engine + socket events
     */
    async buyProperty(userId) {
        // Use pure engine logic
        const result = this.engine.buyProperty(userId);
        const player = this.state.getPlayer(userId);
        
        if (!player) {
            throw new Error("Player not found");
        }
        
        // Build response from state
        const gameResponse = this.buildGameResponse();
        const playerIndex = this.state.getPlayerIndex(userId);
        const statePlayer = this.state.players[playerIndex];
        
        // Calculate properties for response from state
        const yourProperties = gameResponse.boardState.filter((prop) => {
            return statePlayer.properties.includes(prop.id);
        });
        
        const otherPlayersProperties = [];
        this.state.players.forEach((stateP, idx) => {
            const props = gameResponse.boardState.filter((prop) => {
                return stateP.properties.includes(prop.id);
            });
            otherPlayersProperties.push({ 
                player: gameResponse.players[idx], 
                properties: props 
            });
        });
        
        const yourMoney = statePlayer.money;
        const socket = this.getSocket(userId);
        const property = this.buildSpaceResponse(player.position);
        const playerUser = this.getPopulatedUser(userId);
        
        socket.to(this.code).emit("property-bought", {
            player: playerUser?.username || playerUser,
            property: property.name,
            game: gameResponse,
            otherPlayersProperties: otherPlayersProperties
        });
        
        return {
            game: gameResponse,
            yourProperties: yourProperties,
            yourMoney: yourMoney
        };
    }
    
    /**
     * Pay rent - orchestrates engine + socket events
     */
    async payRent(userId, recipient, space) {
        const recipientId = recipient._id?.toString() || recipient?.toString() || recipient;
        const rentAmount = space.base || space.rent || 0;
        
        // Use pure engine logic
        this.engine.payRent(userId, recipientId, rentAmount);
        
        // Build response from state
        const gameResponse = this.buildGameResponse();
        const playerIndex = this.state.getPlayerIndex(userId);
        const receiverIndex = this.state.getPlayerIndex(recipientId);
        
        const statePlayer = this.state.players[playerIndex];
        const stateReceiver = this.state.players[receiverIndex];
        
        const playerMoney = statePlayer.money;
        const receiverMoney = stateReceiver.money;
        
        const otherPlayersProperties = [];
        this.state.players.forEach((stateP, idx) => {
            const props = gameResponse.boardState.filter((prop) => {
                return stateP.properties.includes(prop.id);
            });
            otherPlayersProperties.push({ 
                player: gameResponse.players[idx], 
                properties: props 
            });
        });
        
        const socket = this.getSocket(userId);
        socket.to(this.code).emit("paid-rent", {
            player: gameResponse.players[playerIndex],
            reciever: gameResponse.players[receiverIndex],
            space: space,
            game: gameResponse,
            yourMoney: receiverMoney,
            otherPlayersProperties
        });
        
        const userIdStr = userId?.toString() || userId;
        const oPP = otherPlayersProperties.filter(
            (opp) => {
                const oppUserId = opp.player.userId?._id?.toString() || opp.player.userId?.toString() || opp.player.userId;
                return oppUserId !== userIdStr;
            }
        );
        
        return {
            game: gameResponse,
            yourMoney: playerMoney,
            otherPlayersProperties: oPP
        };
    }
    
    /**
     * Offer trade - orchestrates socket events (no state changes)
     */
    async offerTrade(userId, tradeOffer) {
        const playerIndex = this.state.getPlayerIndex(userId);
        const recipientId = tradeOffer.recipient.player.userId._id?.toString() || 
                          tradeOffer.recipient.player.userId?.toString();
        const receiverIndex = this.state.getPlayerIndex(recipientId);
        
        if (playerIndex === -1 || receiverIndex === -1) {
            throw new Error("Player not found");
        }
        
        // Build response to get populated player data
        const gameResponse = this.buildGameResponse();
        const player = gameResponse.players[playerIndex];
        const receiver = gameResponse.players[receiverIndex];
        
        const socket = this.getSocket(userId);
        socket.to(this.code).emit("trade-offer", { player, receiver, tradeOffer });
        
        return { message: "Trade Offered" };
    }
    
    /**
     * Accept trade - orchestrates engine + socket events
     */
    async acceptTrade(userId, tradeOffer) {
        const senderId = tradeOffer.sender._id?.toString() || tradeOffer.sender?.toString();
        const receiverId = userId?.toString() || userId;
        
        // Use pure engine logic
        this.engine.executeTrade(senderId, receiverId, tradeOffer);
        
        // Build response from state
        const gameResponse = this.buildGameResponse();
        const senderIndex = this.state.getPlayerIndex(senderId);
        const receiverIndex = this.state.getPlayerIndex(receiverId);
        
        const stateReceiver = this.state.players[receiverIndex];
        const stateSender = this.state.players[senderIndex];
        
        const yourMoney = stateReceiver.money;
        const yourProperties = gameResponse.boardState.filter((prop) => {
            return stateReceiver.properties.includes(prop.id);
        });
        const senderProperties = gameResponse.boardState.filter((prop) => {
            return stateSender.properties.includes(prop.id);
        });
        
        const otherPlayersProperties = [];
        this.state.players.forEach((stateP, idx) => {
            const props = gameResponse.boardState.filter((prop) => {
                return stateP.properties.includes(prop.id);
            });
            otherPlayersProperties.push({ 
                player: gameResponse.players[idx], 
                properties: props 
            });
        });
        
        const socket = this.getSocket(userId);
        socket.to(this.code).emit("trade-accepted", {
            game: gameResponse,
            sender: gameResponse.players[senderIndex],
            senderProperties: senderProperties,
            otherPlayersProperties
        });
        
        return {
            game: gameResponse,
            yourMoney,
            yourProperties,
            otherPlayersProperties
        };
    }
    
    /**
     * Reject trade - orchestrates socket events (no state changes)
     */
    async rejectTrade(userId, tradeOffer) {
        const socket = this.getSocket(userId);
        socket.to(this.code).emit("trade-rejected", { tradeOffer });
        return { message: "Trade rejected", tradeOffer };
    }
    
    /**
     * Build house - orchestrates engine + socket events
     */
    async buildHouse(userId, propertyIdx) {
        // Use pure engine logic
        this.engine.buildHouse(userId, propertyIdx);
        
        return { message: "House Built Successfully" };
    }
    
    /**
     * Mortgage property - orchestrates engine + socket events
     */
    async mortgageProperty(userId, propertyIdx) {
        // Use pure engine logic
        this.engine.mortgageProperty(userId, propertyIdx);
        
        // Build response from state
        const gameResponse = this.buildGameResponse();
        const property = gameResponse.boardState[propertyIdx];
        
        const socket = this.getSocket(userId);
        socket.to(this.code).emit("mortgaged-prop", { game: gameResponse });
        
        return { game: gameResponse, property };
    }
    
    /**
     * Unmortgage property - orchestrates engine + socket events
     */
    async unmortgageProperty(userId, propertyIdx) {
        // Use pure engine logic
        this.engine.unmortgageProperty(userId, propertyIdx);
        
        // Build response from state
        const gameResponse = this.buildGameResponse();
        
        const socket = this.getSocket(userId);
        socket.to(this.code).emit("unmortgaged-prop", { game: gameResponse });
        
        return { game: gameResponse };
    }
    
    /**
     * Sell house - orchestrates engine + socket events
     */
    async sellHouse(userId, propertyIdx) {
        // Use pure engine logic
        this.engine.sellHouse(userId, propertyIdx);
        
        // Build response from state
        const gameResponse = this.buildGameResponse();
        
        const socket = this.getSocket(userId);
        socket.to(this.code).emit("sold-house", { game: gameResponse });
        
        return { game: gameResponse };
    }
    
    /**
     * Get loan - orchestrates engine logic
     */
    async getLoan(userId, loanAmt) {
        // Use pure engine logic
        this.engine.takeLoan(userId, loanAmt);
        
        // Build response from state
        const gameResponse = this.buildGameResponse();
        
        return { game: gameResponse };
    }
    
    /**
     * Join game - orchestrates engine + socket events
     */
    async joinGame(userId) {
        // Use pure engine logic
        this.engine.joinGame(userId);
        
        // Build response from state (gameDoc gets updated when player joins, but we use state)
        const gameResponse = this.buildGameResponse();
        
        // Emit socket events
        this.io.to(this.code).emit("joined-room", gameResponse);
        
        return gameResponse;
    }
    
    /**
     * Start game - orchestrates engine + socket events
     */
    async startGame() {
        // Use pure engine logic
        const result = this.engine.startGame();
        
        // Build response from state
        const gameResponse = this.buildGameResponse();
        
        // Build idToIndexMap for backward compatibility with socket events
        const idToIndexMap = {};
        this.state.players.forEach((p, index) => {
            idToIndexMap[p.userId] = index;
        });
        
        // Emit socket events
        this.io.to(this.code).emit("game-started", { 
            game: gameResponse, 
            idToIndexMap 
        });
        this.io.to(this.code).emit("player-turn", {
            currentTurn: gameResponse.currentTurn,
            game: gameResponse
        });
        
        return { game: gameResponse, idToIndexMap };
    }
    
    /**
     * Save game to database
     */
    async endGame() {
        this.syncToDocument();
        await this.gameDoc.save();
        return this.gameDoc;
    }
}

// In-memory cache for active GameSessions
const activeSessions = new Map();

/**
 * Get or create a GameSession instance
 * If session exists in cache, returns it (preserves in-memory state)
 * If not, loads from database and creates new session
 */
export async function getGameSession(code, GameModel, io, getSocket, populateFields = "players.userId") {
    // Return existing session if in cache (preserves in-memory state)
    if (activeSessions.has(code)) {
        return activeSessions.get(code);
    }
    
    // Load from database only when creating new session
    const gameDoc = await GameModel.findOne({ code }).populate(populateFields);
    if (!gameDoc) {
        throw new Error("Game not found");
    }
    
    const session = new GameSession(code, gameDoc, io, getSocket);
    activeSessions.set(code, session);
    return session;
}

/**
 * Remove session from cache
 */
export function removeGameSession(code) {
    activeSessions.delete(code);
}

/**
 * Clear all sessions (useful for testing)
 */
export function clearSessionCache() {
    activeSessions.clear();
}

