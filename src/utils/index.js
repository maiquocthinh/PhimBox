const bcrypt = require('bcryptjs');

const validateEmail = (email) =>
	String(email)
		.toLowerCase()
		.match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
		);

const generateHashPassword = (password) => {
	const salt = bcrypt.genSaltSync(10);
	const hashPassword = bcrypt.hashSync(password, salt);
	return hashPassword;
};
module.exports = { validateEmail, generateHashPassword };
