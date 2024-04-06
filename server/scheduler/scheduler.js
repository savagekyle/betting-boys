import cron from 'node-cron';

import storeGames from "../functions/storeGames.js";
import gameResults from "../functions/gameResults.js";

const cronFunc = () => {

    // Schedule function1 to run at 9 AM every day
    cron.schedule('00 10 * * *', () => {
        console.log('Running function1 at 9 AM');
        gameResults(); // Call your function to store data to the database
    });

    // Schedule function2 to run at 1 PM every day
    cron.schedule('00 12 * * *', async () => {
        console.log('Running function2 at 1 PM');
        storeGames(); // Call your function to store data to the database
    });

}
export default cronFunc;