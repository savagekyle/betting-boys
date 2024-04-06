import { Game } from "../model/model.js";

export const getAllGames = async (req, res) => {
    try {
        const data = await Game.find();
        res.json(data);
    } catch (error) {
        console.error("Error getting all games data: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getGamesByDate = async (req, res) => {
    try {
        const data = await Game.find({ "game.commenceTime": req.params.date });
        res.json(data);
    } catch (error) {
        console.error("Error getting games for date: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getGameByDateAndTeam = async (req, res) => {
    try {
        const query = {
            "game.commenceTime": req.params.date,
            "game.homeTeam": req.params.team
        };
        const data = await Game.find(query);
        res.json(data);
    } catch (error) {
        console.error("Error getting game by date and team: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const gameExistsByDateAndTeam = async (date, team) => {
    try {
        const query = {
            "game.commenceTime": date,
            "game.homeTeam": team
        };
        const data = await Game.find(query);
        if (data.length !== 0) {
            return true;
        } else if (data.length === 0) {
            return false;
        }
    } catch (error) {
        console.error("Error getting game by date and team: ", error);
    }
};

//Get data by game
// app.get('/api/getOne/:id', async (req, res) => {
//     try {
//         const data = await Team.find({ teamName: req.params.teamName });
//         res.json(data)
//     } catch (e) {
//         console.error("Error getting team data: " , e)
//     }
// })
