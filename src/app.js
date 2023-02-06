const express = require('express');
const app = express();
const path = require('path');
// const morgan = require("morgan");
const cookieParser = require('cookie-parser');
require('dotenv').config();

const PORT = process.env.PORT || 8000;

const routes = require('./routes');
const db = require('./config/db/index.db');

// Connect Database
db.connect();

// Set Static
app.use(express.static(path.join(__dirname, 'public')));

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// HTTP logger
// app.use(morgan('combined'));
// app.use(morgan("dev"));

// Template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'resources', 'views'));

// Init Routes
routes(app);

app.listen(PORT, () => {
	console.log(`App listening on PORT ${PORT}`);
});
