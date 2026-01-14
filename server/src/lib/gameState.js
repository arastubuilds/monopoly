import { getSocket, io } from "../lib/socket.js";
import { handleLandedOn } from "./gameUtils.js";

export default class Game {

    constructor(code, hostId, currentTurn, boardState){
        this.code = code;
        this.hostId = hostId;
        this.currentTurn = currentTurn;
        this.boardState = boardState;
        this.players = [];
        this.idToIndexMap = {};
        this.turnOrder = [];
        this.started = false;
        this.winner = null;

    }
    join(userId){
        const playerExists = this.players.some(player => player.userId.toString() === userId.toString());
        if (playerExists) throw new Error("Player already joined");
        if (this.players.length >= 6) throw new Error("Room is Full");
        this.game.players.push(userId);
    }
    start(){
        if (this.players.length < 2) throw new Error("2 or more players required");
        this.players.forEach((p, index) => {
            idToIndexMap[p.userId._id.toString()] = index;
        });
        this.turnOrder = this.players.map(player => player.userId._id.toString());
        this.turnOrder.sort(() => Math.random() - 0.5);

        this.currentTurn = this.turnOrder[0];
        this.started = true;
    }
    rollDice(userId){
        if (this.currentTurn.toString() !== userId.toString()) throw new Error("Not Your Turn");
        const playerIndex = this.idToIndexMap[userId.toString()];
        if (!playerIndex) throw new Error("Player not found");

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
            dice: { die1, die2 },
            number: roll,
        });
    }
    endTurn(userId) {
        const nextIndex = (this.idToIndexMap[userId] + 1) % this.players.length;
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
        return {
            message: `You Bought ${property.name}`,
            game: this,
            yourIndex: playerIndex,
            yourProperties: player.properties,
            yourMoney: player.money,
        }
    }
    payRent(userId, recipient, space) {
        const playerIndex = this.idToIndexMap[userId.toString()];
        const recipientIndex = this.idToIndexMap[recipient.toString()];
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
}
