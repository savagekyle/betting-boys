import fetch from 'node-fetch';
import { Game } from "../model/model.js";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { gameExistsByDateAndTeam } from "../functions/dbFunctions.js"
dotenv.config();

const storeGames = async () => {
    const API_KEY = process.env.API_KEY_ACC2;

    const url = 'https://odds.p.rapidapi.com/v4/sports/icehockey_nhl/odds?regions=us&oddsFormat=american&markets=h2h%2Cspreads%2Ctotals&dateFormat=iso';
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': 'odds.p.rapidapi.com'
        }
    };

    //Call function to store games to variable
    const games = await getData(url, options);

    //stores data in DB
    if (games.length === 0) {
        console.log("No games will be stored");
    } else if (games.length !== 0) {
        saveData(games);

    }


    async function getData(url, options) {
        try {
            const response = await fetch(url, options);
            const data = await response.json();
            const games = [];

            data.forEach(event => {
                games.push({ id: event.id, homeTeam: event.home_team, awayTeam: event.away_team, commence_time: event.commence_time, draftkings: event.bookmakers.find((sportsBook) => sportsBook.key === "draftkings") });
            });

            const gameData = [];
            const todaysDate = new Date().getDate();
            let finalGameList = []

            try {
                games.forEach(e => {
                    if (e.commence_time) {
                        let gameDate = new Date(e.commence_time);
                        gameDate = gameDate.getDate();
                        if (todaysDate == gameDate) {
                            let index = games.findIndex(obj => obj.id === e.id);
                            gameData.push(e);
                        }
                    }
                });
            } catch (e) {
                console.error("Error while clearing gameData:\n" + e)
            }

            try {
                finalGameList = checkIfGameExists(gameData);
            } catch (e) {
                console.error("Error checking if the games are stored in the DB: ", e)
            }
            return finalGameList;

        } catch (error) {
            console.error(error);
        }
    }

    //function to turn price or point into strings
    function pricePointsToString(priceOrPoint) {
        if (priceOrPoint > 0) {
            priceOrPoint = "+" + priceOrPoint.toString();
        } else if (priceOrPoint < 0) {
            priceOrPoint = priceOrPoint.toString();
        }

        return priceOrPoint;
    }

    //Save upcoming games in DB
    function saveData(games) {
        games.forEach(e => {

            let gameDate = new Date(games[0].commence_time);
            gameDate = `${gameDate.getFullYear()}-${gameDate.getMonth() + 1}-${gameDate.getDate()}`

            //Used below correcntly store home team as the first Obj in spreads obj
            let homeTeam = e.homeTeam

            let homeTeamH2H = {};
            let awayTeamH2H = {};

            if (homeTeam === e.draftkings.markets[0].outcomes[0].name) {
                homeTeamH2H = e.draftkings.markets[0].outcomes[0];
                awayTeamH2H = e.draftkings.markets[0].outcomes[1];
            }
            else if (homeTeam === e.draftkings.markets[0].outcomes[1].name) {
                homeTeamH2H = e.draftkings.markets[0].outcomes[1];
                awayTeamH2H = e.draftkings.markets[0].outcomes[0];
            }

            let homeTeamObj = {};
            let awayTeamObj = {};

            if (homeTeam === e.draftkings.markets[1].outcomes[0].name) {
                homeTeamObj = e.draftkings.markets[1].outcomes[0];
                awayTeamObj = e.draftkings.markets[1].outcomes[1];
            }
            else if (homeTeam === e.draftkings.markets[1].outcomes[1].name) {
                homeTeamObj = e.draftkings.markets[1].outcomes[1];
                awayTeamObj = e.draftkings.markets[1].outcomes[0];
            }

            try {
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
                                    name: homeTeamH2H.name,
                                    price: pricePointsToString(homeTeamH2H.price)
                                },
                                team2:
                                {
                                    name: awayTeamH2H.name,
                                    price: pricePointsToString(awayTeamH2H.price)
                                }
                            },
                            spreads:
                            {
                                team1:
                                {
                                    name: homeTeamObj.name,
                                    price: pricePointsToString(homeTeamObj.price),
                                    point: pricePointsToString(homeTeamObj.point)
                                },
                                team2:
                                {
                                    name: awayTeamObj.name,
                                    price: pricePointsToString(awayTeamObj.price),
                                    point: pricePointsToString(awayTeamObj.point)
                                }
                            },
                            totals:
                            {
                                over:
                                {
                                    price: pricePointsToString(e.draftkings.markets[2].outcomes[0].price),
                                    point: e.draftkings.markets[2].outcomes[0].point
                                },
                                under:
                                {
                                    price: pricePointsToString(e.draftkings.markets[2].outcomes[1].price),
                                    point: e.draftkings.markets[2].outcomes[1].point
                                }
                            },
                        }
                    }
                });
                game.save();

            } catch (error) {
                console.error("Error trying to save data in db: ", error);
                console.log("current element that caused error:\n " + e)
            }


            console.log("Games have been stored :)")

        });
    }

    async function checkIfGameExists(gameData) {
        const gameList = [];
        for (const e of gameData) {
            let gameDate = new Date(e.commence_time);
            gameDate = `${gameDate.getFullYear()}-${gameDate.getMonth() + 1}-${gameDate.getDate()}`;

            let gameExists = await gameExistsByDateAndTeam(gameDate, e.homeTeam);
            if (!gameExists) {
                gameList.push(e);
            } else {
                console.log(`Game at ${gameDate} with home team: ${e.homeTeam} is already store in DB`);
            }
        }
        return gameList;
    }
}
export default storeGames