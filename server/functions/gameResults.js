import fetch from 'node-fetch';
import { Game } from "../model/model.js";
import * as dotenv from "dotenv";
dotenv.config();



const gameResults = async () => {
    const API_KEY = process.env.API_KEY_ACC2;

    const url = 'https://odds.p.rapidapi.com/v4/sports/icehockey_nhl/scores?daysFrom=1';
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': 'odds.p.rapidapi.com'
        }
    };

    //Used to pull game results data
    const gameResultsData = await getGameResults(url, options);
    saveMatchResults(gameResultsData)


    async function getGameResults(url, options) {
        try {
            const response = await fetch(url, options);
            const data = await response.json();

            const gameResults = [];

            data.forEach(event => {
                gameResults.push({ completed: event.completed, homeTeam: event.home_team, awayTeam: event.away_team, scores: event.scores });
            });

            const gameData = [];

            try {
                gameResults.forEach(e => {
                    if (e.completed === true) {
                        gameData.push(e);
                    }
                });
            } catch (e) {
                console.error("Error while storing game results data: ", e)
            }
            return gameData;

        } catch (e) {
            console.error("Error fetching game results: ", error);
        }
    }
}

async function saveMatchResults(gameResultsData) {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1)}-${today.getDate() - 1}`;
    try {
        // Loop through dummyGames array
        for (const gameData of gameResultsData) {
            // Construct query to find game document

            const query = {
                "$and": [
                    {
                        "game.commenceTime": { "$in": [formattedDate] }, //todays date 
                        "game.homeTeam": { "$in": [gameData.homeTeam] }
                    }
                ]
            };

            const game1 = await Game.findOne(query);
            if (!game1) {
                console.log(`No data found for game: ${gameData.homeTeam} and date: ${formattedDate}`)
            } else if (game1.game.results && Array.isArray(game1.game.results)) {
                console.log(`The results are already store for game: ${gameData.homeTeam} and date: ${formattedDate}`);
            }
            else if (game1) {
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
                        console.log("Pushed results for Game id: ", gameId)
                        const result = await Game.updateOne(
                            { _id: gameId },
                            { $push: { 'game.results': gameResults } } // Push gameResults directly
                        );

                        //console.log('Game results updated successfully:', result);
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

export default gameResults