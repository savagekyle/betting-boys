import React, { useState, useEffect } from 'react';
import Card from "@mui/material/Card"
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TeamLogo from './TeamLogo';
import teamNames from '../teamNames';
import TeamStats from "../components/TeamStats"

const Home = () => {

    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate() - 1}`;

    const [games, setGames] = useState([]);
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch(`http://localhost:9010/api/getGamesByDate/${formattedDate}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const jsonData = await response.json(); // Parse the JSON response
            setGames(jsonData)
        } catch (e) {
            console.error("Error while getting game results in Home: ", e);
        }
    }

    //Display
    const [show, setShow] = useState(false);
    const [teamName, setTeamName] = useState("")
    const callTeamStats = (teamName) => {
        if (show === true) {
            setShow(false);
        } else {
            setShow(true);
        }
        setTeamName(teamName);
    }

    return (
        <div>
            <h1>Home page</h1>
            <p>welcome to Betting-Boys</p>
            <br></br>
            <h2>Game Results</h2>
            {games.map((team, index) => (
                <>
                    <br></br>
                    <Card key={index} sx={{ maxWidth: 400 }}>
                        <CardContent>
                            <TeamLogo team={team.game.awayTeam} /> <TeamLogo team={team.game.homeTeam} />
                            <Typography className="teamNames">{team.game.awayTeam} Vs {team.game.homeTeam}</Typography>
                            <Typography variant="body2" color="text.primary">Results</Typography>
                            <Typography variant="body2" color="text.primary">Winner: {team.game.results[0].winner} </Typography>
                            {team.game.results[0].overResult ? (
                                <Typography variant="body2" color="text.primary">Over Hit</Typography>
                            ) : (
                                <Typography variant="body2" color="text.primary">Under Hit</Typography>
                            )}
                            {team.game.results[0].spreadResults.team1.spreadResults ? (
                                <Typography variant="body2" color="text.primary">{team.game.results[0].spreadResults.team1.name} covered the spread</Typography>
                            ) : (
                                < Typography variant="body2" color="text.primary">{team.game.results[0].spreadResults.team2.name} covered the spread</Typography>

                            )}
                        </CardContent>
                    </Card >
                </>
            ))
            }
            <div className="teamsList">
                <select name="NHLTeams" id="NHLTeams">
                    {teamNames.map((teamName) => (
                        <option onClick={(e) => callTeamStats(e.target.text)}>{teamName}</option>
                    ))}
                </select>
            </div>
            {show && <TeamStats name={teamName} />}
        </div >
    )
}

export default Home;