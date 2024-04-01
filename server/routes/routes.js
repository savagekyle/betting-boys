import express from "express"
const router = express.Router()
import { Game, GameResults } from "../model/model.js";
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
    .catch((e) => console.error(e));

app.listen(port, () => {
    console.log("Server listening on port " + port)
})


//Get all games data
app.get('/api/getAll', async (req, res) => {
    try {
        const data = await Game.find();
        res.json(data)
    } catch (e) {
        console.error("Error getting all games data: ", error)
    }
})

//Get game with date
app.get('/api/getGamesByDate/:date', async (req, res) => {
    try {
        const data = await Game.find({ "game.commenceTime": req.params.date });
        res.json(data)
    } catch (e) {
        console.error("Error getting all games for date: ", error)
    }
})

//Get game with date and homeTeam
app.get("/api/getGameByDate&HomeTeam/:date/:homeTeam", async (req, res) => {
    try {

        const query = {
            "$and": [
                {
                    "game.commenceTime": { "$in": [req.params.date] },
                    "game.homeTeam": { "$in": [req.params.homeTeam] }
                }
            ]
        }

        const data = await Game.find(query);

        res.json(data)
    } catch (e) {
        console.error("Error getting game with specific date: ", e)
    }
})

//Get data by game
// app.get('/api/getOne/:id', async (req, res) => {
//     try {
//         const data = await Team.find({ teamName: req.params.teamName });
//         res.json(data)
//     } catch (e) {
//         console.error("Error getting team data: " , e)
//     }
// })


 //const games = await storeGames();
 //saveGamesData(games);

//function to turn price or point into strings
function pricePointsToString(priceOrPoint){
    if(priceOrPoint > 0){
        priceOrPoint = "+" + priceOrPoint.toString();
    }else if(priceOrPoint < 0){
        priceOrPoint = priceOrPoint.toString();
    }

    return priceOrPoint;
}

//Save upcoming games in DB
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
                            price: pricePointsToString(e.draftkings.markets[0].outcomes[0].price)
                        },
                        team2:
                        {
                            name: e.draftkings.markets[0].outcomes[1].name,
                            price: pricePointsToString(e.draftkings.markets[0].outcomes[1].price)
                        }
                    },
                    spreads:
                    {
                        team1:
                        {
                            name: e.draftkings.markets[1].outcomes[0].name,
                            price: pricePointsToString(e.draftkings.markets[1].outcomes[0].price),
                            point: pricePointsToString(e.draftkings.markets[1].outcomes[0].point)
                        },
                        team2:
                        {
                            name: e.draftkings.markets[1].outcomes[1].name,
                            price: pricePointsToString(e.draftkings.markets[1].outcomes[1].price),
                            point: pricePointsToString(e.draftkings.markets[1].outcomes[1].point)
                        }
                    },
                    totals:
                    {
                        over:
                        {
                            price: pricePointsToString(e.draftkings.markets[2].outcomes[0].price),
                            point: pricePointsToString(e.draftkings.markets[2].outcomes[0].point)
                        },
                        under:
                        {
                            price: pricePointsToString(e.draftkings.markets[2].outcomes[1].price),
                            point: pricePointsToString(e.draftkings.markets[2].outcomes[1].point)
                        }
                    },
                }
            }
        });

        game.save();

        console.log("Games have been stored :)")
    })
}

//Used to pull game results data
// const gameResultsData = await gameResults();
// saveMatchResults(gameResultsData)


async function saveMatchResults(gameResultsData) {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    try {

        // Loop through dummyGames array
        for (const gameData of gameResultsData) {
            // Construct query to find game document

            const query = {
                "$and": [
                    {
                        "game.commenceTime": { "$in": [formattedDate] }, //todays date 
                        //"game.commenceTime": { "$in": ["2024-03-30"] }, //Hardcoded date
                        "game.homeTeam": { "$in": [gameData.homeTeam] }
                    }
                ]
            };

            const game1 = await Game.findOne(query);
            if (!game1) {
                console.log(`No data found for game: ${gameData.homeTeam} and date: ${formattedDate}`)
            } else if (game1) {
                const gameId = game1._id;

                //storing game odds from the db
                const gameOdds = {
                    over: game1.game.odds_before.totals.over.point,
                    spreads: game1.game.odds_before.spreads
                }

                //getting team winner
                const homeScore = parseInt(gameData.scores[0].score); // Parse score to integer
                const awayScore = parseInt(gameData.scores[1].score); // Parse score to integer
                let winner;

                // Compare scores to determine the winner
                if (homeScore > awayScore) {
                    winner = gameData.homeTeam;
                } else if (homeScore < awayScore) {
                    winner = gameData.awayTeam;
                }

                //getting over/under results
                let overResult = false;
                let underResult = false;

                if (homeScore + awayScore > gameOdds.over) {
                    overResult = true;
                } else if (homeScore + awayScore < gameOdds.over) {
                    underResult = true
                }

                //seeing what team covered the spread
                // Parse the spread points for each team
                const team1Spread = parseFloat(gameOdds.spreads.team1.point);
                const team2Spread = parseFloat(gameOdds.spreads.team2.point);

                // Determine if the spread is covered
                const spreadOutcomeTeam1 = awayScore - homeScore <= team1Spread;
                const spreadOutcomeTeam2 = homeScore - awayScore <= team2Spread;

                const gameResults = {
                    winner: winner,
                    overResult: overResult,
                    underResult: underResult,
                    spreadResults: {
                        team1: {
                            name: gameData.homeTeam,
                            spreadResults: spreadOutcomeTeam1
                        },
                        team2: {
                            name: gameData.awayTeam,
                            spreadResults: spreadOutcomeTeam2
                        }
                    }
                };

                try {
                    if (gameResults) { // Check if gameResults is defined and not empty
                        // Update the document using the gameId
                        const result = await Game.updateOne(
                            { _id: gameId },
                            { $push: { 'game.results': gameResults } } // Push gameResults directly
                        );

                        console.log('Game results updated successfully:', result);
                    } else {
                        console.error('Error updating game results: gameResults is empty or undefined');
                    }
                } catch (error) {
                    console.error('Error updating game results:', error);
                }
            }
        }
    } catch (error) {
        console.error('Error updating scores:', error);
    }
}

