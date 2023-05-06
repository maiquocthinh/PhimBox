const { createClient } = require('redis');

const redisClient = createClient({
	host: process.env.REDIS_HOSTNAME,
	port: process.env.REDIS_PORT,
	password: process.env.REDIS_PASSWORD,
});

redisClient.on('connect', () => {
	console.log('Redis client connected');
});

redisClient.on('error', (error) => {
	console.error(error);
});

module.exports = redisClient;
