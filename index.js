const express = require('express');
const app = express();
const cors = require('cors');
require("dotenv").config();
app.use(express.json());
// app.use(cors)

const { connection } = require('./config/db');
const { CarRouter } = require('./routes/car.routes')
// const { limiter } = require("./middleware/ratelimitter") //express-rate-limit


app.get('/', (req, res) => {
    res.send('Hello, Parking Lot!');
});

// app.use(limiter)
app.use( CarRouter)

app.listen(process.env.port, async() => {
    try {
        await connection;
        console.log('Server listening on port 8080');
    } catch (error) {
        console.log(error);
        console.log('No connection');
    }
  
    
})
