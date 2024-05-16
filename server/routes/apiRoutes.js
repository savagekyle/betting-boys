import express from "express";
const router = express.Router();

// Import database functions
import { getAllGames, getGamesByDate, getGameByDateAndTeam, getGameResultsByTeam, getTeamStats, getLastThreeGamesResults } from "../functions/dbFunctions.js";

// Define routes
router.get('/getAll', getAllGames);
router.get('/getGamesByDate/:date', getGamesByDate);
router.get('/getGameByDateAndTeam/:date/:team', getGameByDateAndTeam);
router.get('/getGameResultsByTeam/:team', getGameResultsByTeam);
router.get('/getTeamStats/:team', getTeamStats);
router.get('/getLastThreeGamesResults/:team', getLastThreeGamesResults);

export default router;