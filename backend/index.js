import 'dotenv/config'

import express from "express";
import db from "./db/db.config.js";
import cors from "cors"
import mainRouter from "./src/api/main.routes.js";
import {errorHandler} from "./src/middleware/errorHandler.js";

const app = express();


app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cors({
    origin: "https://chatgpt-clone-black-nu.vercel.app/" || "http://localhost:5173"
}))
// /api
app.use('/api', mainRouter);

app.use(errorHandler);
async function startServer(){
    try{
        const connection = await db.getConnection();
        connection.release();
        app.listen(3788,err => {
            if(err){
                throw err;
            } 
            console.log('server is running on port http://localhost:3788');
        });
    }
    catch(err){
        console.error('error starting server:', err.message);
    }
}

startServer();