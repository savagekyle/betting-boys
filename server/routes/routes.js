import express from "express"
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import storeGames from "../functions/storeGames.js";
import gameResults from "../functions/gameResults.js";
import router from "./apiRoutes.js";
import cronFunc from "../scheduler/scheduler.js"
import cors from "cors"
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
        socketTimeoutMS: 3000
    })
    .then(() => console.log("MongoDB connected"))
    .catch((e) => console.error("Time out error", e));

app.use(cors());

app.use('/api', router);

app.listen(port, () => {
    console.log("Server listening on port " + port)
})


//storeGames();

//gameResults();

//cronFunc();