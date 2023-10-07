const express = require("express");
const { config } = require("dotenv");
const routes = require("./routes/index.js");
const mongoose = require("mongoose");
const cors = require("cors");

config();

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded());

app.use(routes);

app.use((error, req, res, next)=>{
    res.status(error.status || 500).json({
        error: error.message ||'Problem with exiting request'
    })
})

const listener= app.listen(process.env.API_PORT, process.env.API_HOST, async()=>{
    console.log(`server started at ${listener.address().address}:${listener.address().port}`);
    console.log('Press ctrl + c to stop');
    
    try{
        await mongoose.connect(process.env.MONGO_ADDR);
        console.log('MongoDb connected')
    }catch(err){
        console.error('Problem while connecting MongoDb')
    }
})