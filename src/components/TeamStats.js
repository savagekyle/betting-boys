import React, { useState, useEffect } from 'react';
import TeamLogo from './TeamLogo';
import { PieChart } from '@mui/x-charts/PieChart';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import TeamStatsCSS from '../css/TeamStats.css';

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    color: theme.palette.text.primary,
    height: 60,
    lineHeight: '60px',
}));

const TeamStats = (props) => {
    const team = props.name;

    const [teamAnalytics, setTeamAnalytics] = useState([]);
    useEffect(() => {
        fetchTeamAnalytics(team);
    }, []);

    const fetchTeamAnalytics = async (team) => {
        try {
            const response = await fetch(`http://localhost:9010/api/getTeamStats/${team}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const jsonData = await response.json(); // Parse the JSON response
            setTeamAnalytics(jsonData)
        } catch (e) {
            console.error("Error while getting game analytics: ", e);
        }
    }

    function createData(
        Date: string,
        Opponent: string,
        Over_Under: string,
        Spread: string,
        Moneyline: string,
    ) {
        return { Date, Opponent, Over_Under, Spread, Moneyline };
    }

    let emptyRows = [];


    const [rows, setRows] = useState([]);
    useEffect(() => {
        fetchLast3GameResults(team);
    }, []);

    const fetchLast3GameResults = async (team) => {
        //let dataSet;
        try {
            const response = await fetch(`http://localhost:9010/api/getLastThreeGamesResults/${team}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const jsonData = await response.json(); // Parse the JSON response
            jsonData.forEach((element) => {
                emptyRows.push(createData(element.date, element.opponent, element.over_under, element.spread, element.moneyline));
            });
            setRows(emptyRows)
        } catch (e) {
            console.error("Error while getting game results in Home: ", e);
        }

    }


    return (
        <div>
            <body>
                <div>
                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            '& > :not(style)': {
                                m: 1,
                                width: 550,
                                height: 300,
                            },
                        }}
                    >
                        <Item>
                            <section>
                                <div id="summary">
                                    <div className="logo">
                                        <TeamLogo team={team} />
                                    </div>
                                    <div className="teamName">
                                        <h1>{team}</h1>
                                    </div>
                                    <h1>Stats</h1>
                                    <div id="summary-text">
                                        <dl>
                                            <div>
                                                <dt>Overall Record</dt>
                                                <dd>{teamAnalytics.totalGamesWon}-{teamAnalytics.totalGames - teamAnalytics.totalGamesWon}</dd>
                                            </div>
                                            <div>
                                                <dt>Home Record</dt>
                                                <dd>{teamAnalytics.homeGamesWon}</dd>
                                            </div>
                                            <div>
                                                <dt>Over Record</dt>
                                                <dd>{teamAnalytics.overRecord}</dd>
                                            </div>
                                            <div>
                                                <dt>Spread Record</dt>
                                                <dd>{teamAnalytics.spreadCoveredAmount}</dd>
                                            </div>
                                        </dl>
                                    </div>
                                </div>
                            </section>
                        </Item>
                    </Box>

                </div>

                {/* <PieChart
                    series={[
                        {
                            data: [
                                { id: 0, value: teamAnalytics.spreadCoveredAmount, label: 'Spread covered' },
                                { id: 1, value: teamAnalytics.overRecord, label: 'Over covered' },
                                { id: 2, value: teamAnalytics.homeGamesWon, label: 'Home games' },
                            ],
                        },
                    ]}
                    width={400}
                    height={200}
                /> */}
                <br />
                <div>
                    <h2>Last three Games</h2>
                </div>

                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell align="right">Opponent</TableCell>
                                <TableCell align="right">Over/under</TableCell>
                                <TableCell align="right">Spread</TableCell>
                                <TableCell align="right">Moneyline</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow
                                    key={row.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.Date}
                                    </TableCell>
                                    <TableCell align="right">{row.Opponent}</TableCell>
                                    <TableCell align="right">{row.Over_Under}</TableCell>
                                    <TableCell align="right">{row.Spread}</TableCell>
                                    <TableCell align="right">{row.Moneyline}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

            </body>
        </div>
    )
}

export default TeamStats;