import fetch from 'node-fetch'

const storeGames = () => {

    const url = 'https://odds.p.rapidapi.com/v4/sports/icehockey_nhl/odds?regions=us&oddsFormat=american&markets=h2h%2Cspreads%2Ctotals&dateFormat=iso';
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '0bc9bfac3cmsh9e4d10c83af2714p154bd0jsn5cb890571721',
            'X-RapidAPI-Host': 'odds.p.rapidapi.com'
        }
    };

    return getData(url, options);

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
                console.error("Error while clearing gameData: ", error)
            }
            return gameData;

        } catch (error) {
            console.error(error);
        }
    }
}

export default storeGames