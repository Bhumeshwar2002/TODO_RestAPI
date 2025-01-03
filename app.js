const express = require('express');
const bodyParser = require("body-parser");
const tasksRouter = require('./routes/tasks');
require('dotenv').config() // This will help to load all env file to process.env
// const tasksRouter = require('./routes/tasks');
const authRouter = require('./routes/auth');
const app = express();
const port = 3000;


// Middleware
app.use(bodyParser.json());


// This is used to Test the route
app.get('/', (req,res) =>{
    res.send('Welcome to the TO-DO API');
});

// Authentication routes
app.use('/auth', authRouter);

// use of the task route
app.use('/tasks', tasksRouter);


const SECRET_KEY = process.env.SECRET_KEY;
// console.log('Your secret key:', SECRET_KEY);


// To start the server
app.listen(port , () =>{
    console.log(`Server running on http://localhost:${port}`);
})
