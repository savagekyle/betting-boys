import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

const DB_URL = process.env.DBADDRESS;

mongoose
    .connect(DB_URL, {
        //Connection to the DB
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected"))
    .catch((e) => console.error(e));


