import { getGameResultsByTeamFunction } from "../dbFunctions.js"

const teamStats = async (team) => {
    //let team = "San Jose Sharks";
    let games;
    let totalGames;
    let spreadCoveredAmount;
    let overRecord;
    let homeGamesObj;
    let gamesWon;

    games = await getGameResultsByTeamFunction(team);
    totalGames = games.length;

    spreadCoveredAmount = getSpreadCoveredAmount(games, team);
    overRecord = getOverResults(games);
    homeGamesObj = homeGamesRecord(games, team);
    gamesWon = getGamesWon(games, team);

    const gameStats = {
        totalGames: totalGames,
        spreadCoveredAmount: spreadCoveredAmount,
        overRecord: overRecord,
        totalHomeGames: homeGamesObj.totalHomeGames,
        homeGamesWon: homeGamesObj.homeGamesWon,
        totalGamesWon: gamesWon
    }

    return gameStats;
}

function getSpreadCoveredAmount(games, team) {
    let spreadCovered = 0;
    games.forEach(game => {
        if (team === game.game.results[0].spreadResults.team1.name) {
            if (game.game.results[0].spreadResults.team1.spreadResults === true) {
                spreadCovered = spreadCovered + 1;
            }
        }
        else if (team === game.game.results[0].spreadResults.team2.name) {
            if (game.game.results[0].spreadResults.team2.spreadResults === true) {
                spreadCovered = spreadCovered + 1;
            }
        }
    });
    return spreadCovered;
}

function getOverResults(games) {
    let overResults = 0;
    games.forEach(game => {
        if (game.game.results[0].overResult === true) {
            overResults = overResults + 1;
        }
    })
    return overResults;
}

function homeGamesRecord(games, team) {
    let homeGamesWon = 0;
    let totalHomeGames = 0;

    games.forEach((game) => {
        if (game.game.homeTeam === team && game.game.results[0].winner === team) {
            homeGamesWon = homeGamesWon + 1;
        }
        if (game.game.homeTeam === team) {
            totalHomeGames = totalHomeGames + 1;
        }
    });

    const homeGamesObj = {
        totalHomeGames: totalHomeGames,
        homeGamesWon: homeGamesWon
    }

    return homeGamesObj;
}

function getGamesWon(games, team) {
    let gamesWon = 0;

    games.forEach(game => {
        if (game.game.results[0].winner === team) {
            gamesWon = gamesWon + 1;
        }
    });

    return gamesWon;
}


export default teamStats