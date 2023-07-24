const bcrypt = require('bcryptjs');

const userStatus = {
	ACTIVED: 1,
	BANED: 0,
};

const serviceAccessToken = (() => bcrypt.hashSync(process.env.SERVICE_ACCESS_SECRET))();

module.exports = { userStatus, serviceAccessToken };
