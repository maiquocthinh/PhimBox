const bcrypt = require('bcryptjs');

const userStatus = {
	ACTIVATED: 1,
	BANNED: 0,
};

module.exports = { userStatus };
