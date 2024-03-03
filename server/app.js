import fetch from 'node-fetch'
import express from "express";
import fs from "node:fs"
import { type } from 'node:os';

// const port = process.env.PORT || 3088;

// const app = express();

// app.listen(port, () => {
//     console.log("Server listening on port " + port)
// })



const url = 'https://odds.p.rapidapi.com/v4/sports/icehockey_nhl/odds?regions=us&oddsFormat=american&markets=spreads%2Ctotals&dateFormat=iso';
const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '0bc9bfac3cmsh9e4d10c83af2714p154bd0jsn5cb890571721',
        'X-RapidAPI-Host': 'odds.p.rapidapi.com'
    }
};


//Function that calls the API
getData(url, options);

//Using test file
// let testFile = fs.readFileSync("D:\\Coding\\React\\SportsApp\\server\\test.json", 'utf8')
// let toJson = JSON.parse(testFile);


// Call Sports API to get games data
async function getData(url, options) {
    try {
        const response = await fetch(url, options);
        const data = await response.json();

        const teamNames = [];

        data.forEach(event => {
            teamNames.push({ id: event.id, homeTeam: event.home_team, awayTeam: event.away_team, commence_time: event.commence_time, fanDuelBet: event.bookmakers[2] });
        });

        console.log("Today's Games:");
        teamNames.forEach(team => {
            console.log("Home Team:", team.homeTeam);
            console.log("Away Team:", team.awayTeam);
            console.log("Away Team:", team.fanDuelBet);
            console.log("-----");
        });

        //used for creating json file with todays game
        createJsonFile("NHL", JSON.stringify(teamNames));


    } catch (error) {
        console.error(error);
    }
}


//This creates a JSON file for todays betting data
function createJsonFile(sport, dailyBetsData) {

    const data = cleanData(JSON.parse(dailyBetsData));

    fs.writeFile(`../src/Bets/${sport}/${getCurrDate()}.json`, JSON.stringify(data), err => {

        if (err) throw err;
        // Success 
        console.log("File was created")
    });

}

//Set current date to create file
function getCurrDate() {
    const currDate = new Date();
    const month = currDate.getMonth() + 1;
    const day = currDate.getDate();
    const year = currDate.getFullYear();

    return `${month}-${day}-${year}`
}

//Clean dataset so it only contains games for todays date
function cleanData(dailyBetsData) {

    const todaysDate = new Date().getDate();
    const data = [];
    try {
        dailyBetsData.forEach(e => {
            if (e.commence_time) {
                let gameDate = new Date(e.commence_time);
                gameDate = gameDate.getDate();
                if (todaysDate == gameDate) {
                    let index = dailyBetsData.findIndex(obj => obj.id === e.id);
                    data.push(e);
                }
            }
        });
    } catch (e) {
        console.log("Error on cleanData function:\n" + e)
    }


    return data;
}