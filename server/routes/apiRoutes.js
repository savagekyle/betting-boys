import express from "express";
const router = express.Router();

// Import database functions
import { getAllGames, getGamesByDate, getGameByDateAndTeam } from "../functions/dbFunctions.js";

// Define routes
router.get('/getAll', getAllGames);
router.get('/getGamesByDate/:date', getGamesByDate);
router.get('/getGameByDateAndTeam/:date/:team', getGameByDateAndTeam);

export default router;
