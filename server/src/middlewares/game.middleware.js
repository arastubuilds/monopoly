import Game from "../models/game.model.js";

export const checkGame = async (req, res, next) => {
    try {
        const {code} = req.params;
        const game = await Game.findOne({code});
        if (!game)
            return res.status(404).json({message: "Game not found"});
        
        if (game.started)
            return res.status(400).json({message:"Game already started"});

        next();
    } catch (error) {
        console.log("Error in checkGame middleware", error);
        return res.status(400).json({message: "Internal Server Error"});
    }
}
export const checkGameJoined = async(req, res, next) => {
    try {
        const userId = req.user._id;
        console.log(userId);
        const {code} = req.params;
        const game = await Game.findOne({code}).populate("players.userId", "username");

        if (!game)
            return res.status(404).json({message: "Game not found"});
        
        console.log(game.players);
        if (game.started && !game.players.some(user => user.userId._id.toString() === userId.toString()))
            return res.status(400).json({message: "Not member of started game"});
        next();
    } catch (error) {
        console.log("Error checking joined game", error);
        return res.status(400).json({message: "Internal Server Error"});
    }
}
