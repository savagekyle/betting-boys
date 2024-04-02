import express from "express"
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import storeGames from "../functions/storeGames.js";
import gameResults from "../functions/gameResults.js";
import router from "./apiRoutes.js";

dotenv.config();

const port = process.env.PORT || 3088;
const DB_URL = process.env.DBADDRESS;
const app = express();

//Connect to mongoDB server
mongoose
    .connect(DB_URL, {
        //Connection to the DB
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected"))
    .catch((e) => console.error(e));

app.listen(port, () => {
    console.log("Server listening on port " + port)
})

app.use('/api', router);

//storeGames();

//gameResults();

