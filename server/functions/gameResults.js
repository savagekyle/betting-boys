import fetch from 'node-fetch'

const gameResults = () => {

    const url = 'https://odds.p.rapidapi.com/v4/sports/icehockey_nhl/scores?daysFrom=1';
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '0bc9bfac3cmsh9e4d10c83af2714p154bd0jsn5cb890571721',
            'X-RapidAPI-Host': 'odds.p.rapidapi.com'
        }
    };

    return getGameResults(url, options);

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
                console.log("Error while storing game results data:\n" + e)
            }
            return gameData;

        } catch (error) {
            console.error("Error fetching game results" + error);
        }
    }
}

export default gameResults