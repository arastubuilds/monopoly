import express from "express";
import { buyProp, createGame, endTurn, joinGame, payRent, rollDice, startGame, offerTrade } from "../controllers/game.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { checkGame, checkHost, checkGameJoined } from "../middlewares/game.middleware.js";

const router = express.Router();

router.use(protectRoute);
router.post("/create", createGame);
router.post("/join/:code", checkGame, joinGame);
router.post("/start/:code", checkGame, checkHost, startGame);
router.post("/:code/roll", checkGameJoined, rollDice);
router.post("/:code/endTurn", checkGameJoined, endTurn);
router.post("/:code/buy", checkGameJoined, buyProp);
router.post("/:code/pay", checkGameJoined, payRent);
router.post("/:code/offer-trade", checkGameJoined, offerTrade);

export default router;