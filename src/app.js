const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const fileupload = require('express-fileupload');
const RedisStore = require('connect-redis')(session);
// const morgan = require("morgan");
require('dotenv').config();

const routes = require('./routes');
const db = require('./config/db.config');
const redisClient = require('./database/init.redis');

const PORT = process.env.PORT || 8000;

// Connect Database
db.connect();

// Set Static
app.use(express.static(path.join(__dirname, '../public')));

// middlewares
app.use(
	session({
		store: new RedisStore({ client: redisClient }),
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
		cookie: {
			httpOnly: true,
			maxAge: 2 * 60 * 60 * 1000,
		},
	}),
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(fileupload());

// HTTP logger
// app.use(morgan('combined'));
// app.use(morgan("dev"));

// Template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Init Routes
routes(app);

app.listen(PORT, () => {
	console.log(`App listening on PORT ${PORT}`);
});
