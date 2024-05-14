import { Game } from "../model/model.js";
import teamStats from "./Analytics/teamStats.js";

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

export const getGameResultsByTeam = async (req, res) => {
    try {
        const query = {
            "$or": [
                {
                    "game.homeTeam":
                        { "$in": [req.params.team] }
                },
                {
                    "game.awayTeam": { "$in": [req.params.team] }
                }
            ]
        }

        const projections = {
            "_id": 0,
            "game.results": 1,
            "game.homeTeam": 1
        }

        const data = await Game.find(query, projections);
        const result = []
        //Gets rid of objs if there are no results for a game
        data.filter(obj => {
            // if (JSON.stringify(obj) !== "{}") {
            //     result.push(obj)
            // }
            if (obj.game?.results !== undefined) {
                //console.log("its not undefined")
                result.push(obj)
            }
        });
        res.json(result)
    } catch (error) {
        console.error(`Error when getting games for team ${req.params.team}:\n ${error}`)
    }
}

export const getGameResultsByTeamFunction = async (team) => {
    try {
        const query = {
            "$or": [
                {
                    "game.homeTeam":
                        { "$in": [team] }
                },
                {
                    "game.awayTeam": { "$in": [team] }
                }
            ]
        }

        const projections = {
            "_id": 0,
            "game.results": 1,
            "game.homeTeam": 1
        }

        const data = await Game.find(query, projections);
        const result = []
        //Gets rid of objs if there are no results for a game
        data.filter(obj => {
            if (obj.game?.results !== undefined) {
                result.push(obj)
            }
        });
        return result
    } catch (error) {
        console.error(`Error when getting games for team ${team}:\n ${error}`)
    }
}

export const getTeamStats = async (req, res) => {
    try {
        let results = await teamStats(req.params.team);
        res.json(results)
    } catch (e) {
        console.error(`Error on getTeamStats:\n${e}`)
    }
}
//Get data by game
// app.get('/api/getOne/:id', async (req, res) => {
//     try {
//         const data = await Team.find({ teamName: req.params.teamName });
//         res.json(data)
//     } catch (e) {
//         console.error("Error getting team data: " , e)
//     }
// })
