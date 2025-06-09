import express from "express";
import { buyProp, createGame, endTurn, joinGame, payRent, rollDice, startGame } from "../controllers/game.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { checkGame, checkGameJoined } from "../middlewares/game.middleware.js";

const router = express.Router();

router.post("/create", protectRoute, createGame);
router.post("/join/:code", protectRoute, checkGame, joinGame);
router.post("/start/:code", protectRoute, checkGame, startGame);
router.post("/:code/roll", protectRoute, checkGameJoined, rollDice);
router.post("/:code/endTurn", protectRoute, checkGameJoined, endTurn);
router.post("/:code/buy", protectRoute, checkGameJoined, buyProp);
router.post("/:code/pay", protectRoute, checkGameJoined, payRent);

export default router;