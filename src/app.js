require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
// const morgan = require('morgan');
const cookieParser = require("cookie-parser");



const routes = require('./routes');
const db = require('./config/db/index.db');

// Connect Database
db.connect();


// Set Static
app.use(express.static(path.join(__dirname, 'public')));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());


// HTTP logger
// app.use(morgan('combined'));
// app.use(morgan('dev'));


// Template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'resources', 'views'));



// Init Routes
routes(app);


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
});