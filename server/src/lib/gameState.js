// import { getSocket, io } from "../lib/socket.js";
import { handleLandedOn } from "./gameUtils.js";
import { boardData } from "../lib/data.js";

class Player {
    constructor(userId, name){
        this.userId = userId;
        this.userName = name;
        this.money = 15000;
        this.position = 0;
        this.properties = [];
    }
}
export default class Game {

    constructor(code, hostId, hostName){
        this.code = code;
        this.hostId = hostId;
        this.currentTurn = hostId;
        this.boardState = boardData;
        this.players = [new Player(hostId, hostName)];
        this.idToIndexMap = {};
        this.turnOrder = [];
        this.started = false;
        this.winner = null;

    }
    join(userId, userName){
        const playerExists = this.players.some(player => player.userId.toString() === userId.toString());
        if (playerExists) throw new Error("Player already joined");
        if (this.players.length >= 6) throw new Error("Room is Full");
        this.players.push(new Player(userId, userName));
    }
    start(userId){
        if (userId.toString() !== this.hostId.toString()) throw new Error("Not the Host");

        if (this.players.length < 2) throw new Error("2 or more players required");
        this.players.forEach((p, index) => {
            this.idToIndexMap[p.userId.toString()] = index;
        });
        this.turnOrder = this.players.map(player => { return {userId: player.userId.toString(), userName: player.userName}});
        this.turnOrder.sort(() => Math.random() - 0.5);

        this.currentTurn = this.turnOrder[0];
        this.started = true;
        // console.log(this.idToIndexMap);
    }
    rollDice(userId){
        console.log(userId);
        
        if (this.currentTurn.userId.toString() !== userId.toString()) throw new Error("Not Your Turn");
        const playerIndex = this.idToIndexMap[userId.toString()];
        // if (!playerIndex) throw new Error("Player not found");

        const die1 = Math.ceil(Math.random() * 6);
        const die2 = Math.ceil(Math.random() * 6);
        const roll = die1 + die2;

        let newPosition = (this.players[playerIndex].position + roll) % 40;

        if (newPosition < this.players[playerIndex].position) {
            this.players[playerIndex].money += 200; // Add $200 for passing GO
        }

        this.players[playerIndex].position = newPosition;
        const landed = handleLandedOn(this, playerIndex, userId);
        return ({
            message: `Rolled a ${roll}\nLanded on ${landed.space.name}`,
            buy: true,
            pay: false,
            own: false,
            game: this,
            yourIndex: playerIndex,
            landedOn: landed.space,
            dice: { die1: die1, die2: die2 },
            number: roll,
        });
    }
    endTurn(userId) {
        const nextIndex = (this.idToIndexMap[userId] + 1) % this.players.length;
        // console.log("nextIndex", nextIndex);
        
        this.currentTurn = this.turnOrder[nextIndex];
    }
    buyProp(userId) {
        const playerIndex = this.idToIndexMap[userId.toString()];
        const player = this.players[playerIndex];
        const property = this.boardState[player.position];

        if (player.money < property.price) throw new Error("Insufficient Balance");

        player.money -= property.price;
        player.properties.push(property.id);
        property.owned = true;
        property.owner = userId;

        const otherPlayersProperties = [];
        this.players.forEach((p) => {

            const yourProperties = this.boardState.filter((prop) => {
                return p.properties.includes(prop.id);
            });
            otherPlayersProperties.push({player : p, properties: yourProperties});

        });

        return {
            message: `${player.userName} Bought ${property.name}`,
            yourIndex: playerIndex,
            yourProperties: player.properties,
            yourMoney: player.money,
            otherPlayersProperties,
        }
    }
    payRent(userId, recipientId, space) {
        const playerIndex = this.idToIndexMap[userId.toString()];
        const recipientIndex = this.idToIndexMap[recipientId.toString()];
        const player = this.players[playerIndex];
        const recipient = this.players[recipientIndex];
        const rent = space.base;
        if (player.money < rent) throw new Error("Insufficient Balance");
        player.money -= rent;
        recipient.money += rent;
        return {
            message: `You Paid ${rent} to ${recipient.username}`,
            game: this,
            yourIndex: playerIndex,
            yourMoney: player.money,
            recipientIndex: recipientIndex,
            recipientMoney: recipient.money,
        }
    }
    tradeOffer(userId, recipientId, offer) {
        const playerIndex = this.idToIndexMap[userId.toString()];
        const recipientIndex = this.idToIndexMap[recipientId.toString()];
        const player = this.players[playerIndex];
        const recipient = this.players[recipientIndex];
        if (player.money < offer.amount) throw new Error("Insufficient Balance");

    }
    acceptTrade(userId, offer) {
        const playerIndex = this.idToIndexMap[userId.toString()];
        const recipientIndex = this.idToIndexMap[offer.recipient.toString()];
        const player = this.players[playerIndex];
        const recipient = this.players[recipientIndex];
        if (player.money < offer.amount) throw new Error("Insufficient Balance");

        player.properties = player.properties.filter((prop) => {
            return !offer.senderOffer.senderProp.map(p => p.id).includes(prop);
        });
        recipient.properties = recipient.properties.filter((prop) => {
            return !tradeOffer.senderAsk.askedProp.map(p => p.id).includes(prop);
        });

        player.properties.push(... offer.senderAsk.askedProp.map(p => p.id));
        recipient.properties.push(... offer.senderOffer.senderProp.map(p => p.id));

        sender.properties?.forEach((p) => {
            this.boardState[p].owner = player.userId._id;
            console.log(this.boardState[p].owner);
            
        });
        recipient.properties?.forEach((p) => {
            this.boardState[p].owner = recipient.userId._id;
            console.log(this.boardState[p].owner);
        });

        player.money -= offer.senderOffer.senderMoney;
        player.money += offer.senderAsk.askedMoney;

        recipient.money -= offer.senderAsk.askedMoney;
        recipient.money += offer.senderOffer.senderMoney;
    }
    rejectTrade(userId, offer) {
        const playerIndex = this.idToIndexMap[userId.toString()];
        const recipientIndex = this.idToIndexMap[offer.recipient.toString()];
        const player = this.players[playerIndex];
        const recipient = this.players[recipientIndex];
    }
    buildHouse(userId, propId) {
        const playerIndex = this.idToIndexMap[userId.toString()];
        const player = this.players[playerIndex];
        const property = this.boardState[propId];
        if (player.money < property.hcost) throw new Error("Insufficient Balance");
        player.money -= property.hcost;
        property.houses += 1;
        const flag = player.properties.every(p => property.setPairIndices.includes(p));
        if (!flag) throw new Error("Must own all properties in set to build houses");
        if (property.houses >= 4) throw new Error("Cannot build more houses (max 4)");
        property.houses += 1;
        
    }
}
