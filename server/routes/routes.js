import express from "express"
const router = express.Router()
import { Game } from "../model/model.js";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import storeGames from "../functions/storeGames.js";
import gameResults from "../functions/gameResults.js";

dotenv.config();

const port = process.env.PORT || 3088;
const DB_URL = process.env.DBADDRESS;
const app = express();

//Connect to mongoDB server
mongoose
    .connect(DB_URL, {
        //Connection to the DB
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));

app.listen(port, () => {
    console.log("Server listening on port " + port)
})


//Get all teams data
app.get('/api/getAll', async (req, res) => {
    try {
        const data = await Game.find();
        res.json(data)
    } catch (e) {
        console.log("Error getting all games data: " + e.message)
    }
})

//Get teams data with specific game date
app.get('/api/getGamesByDate/:date', async (req, res) => {
    try {
        const data = await Game.find({ "game.commenceTime": req.params.date });
        res.json(data)
    } catch (e) {
        console.log("Error getting all games for date: " + e.message)
    }
})

//Get data by game
// app.get('/api/getOne/:id', async (req, res) => {
//     try {
//         const data = await Team.find({ teamName: req.params.teamName });
//         res.json(data)
//     } catch (e) {
//         console.log("Error getting team data: " + e.message)
//     }
// })



//Used to pull game results data
//const gameResultsData = await gameResults();

//console.log(gameResultsData)

const games = await storeGames();
saveGamesData(games);

//Save upcaoming games in DB
function saveGamesData(games) {
    games.forEach(e => {

        let gameDate = new Date(games[0].commence_time);
        gameDate = `${gameDate.getFullYear()}-${gameDate.getMonth() + 1}-${gameDate.getDate()}`

        const game = new Game({
            _id: new mongoose.Types.ObjectId(),
            game: {
                homeTeam: e.homeTeam,
                awayTeam: e.awayTeam,
                commenceTime: gameDate,
                odds_before: {
                    h2h:
                    {
                        team1:
                        {
                            name: e.draftkings.markets[0].outcomes[0].name,
                            price: e.draftkings.markets[0].outcomes[0].price
                        },
                        team2:
                        {
                            name: e.draftkings.markets[0].outcomes[1].name,
                            price: e.draftkings.markets[0].outcomes[1].price
                        }
                    },
                    spreads:
                    {
                        team1:
                        {
                            name: e.draftkings.markets[1].outcomes[0].name,
                            price: e.draftkings.markets[1].outcomes[0].price,
                            point: e.draftkings.markets[1].outcomes[0].point
                        },
                        team2:
                        {
                            name: e.draftkings.markets[1].outcomes[1].name,
                            price: e.draftkings.markets[1].outcomes[1].price,
                            point: e.draftkings.markets[1].outcomes[1].point
                        }
                    },
                    totals:
                    {
                        over:
                        {
                            price: e.draftkings.markets[2].outcomes[0].price,
                            point: e.draftkings.markets[2].outcomes[0].point
                        },
                        under:
                        {
                            price: e.draftkings.markets[2].outcomes[1].price,
                            point: e.draftkings.markets[2].outcomes[1].point
                        }
                    },
                }
            }
        });

        game.save();

        console.log("Games have been stored :)")
    })
}


