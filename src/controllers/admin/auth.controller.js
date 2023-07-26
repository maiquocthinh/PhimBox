const bcrypt = require('bcryptjs');
const userModels = require('../../models/user.models');
const { validateEmail } = require('../../utils');

// ###### API ######

// [POST] admin/login
const loginHandler = async (req, res) => {
	const { email, password, remember } = req.body;

	if (!email || !password) return res.status(400).json({ message: 'You must enter all fields.' });

	if (!validateEmail(email)) return res.status(400).json({ message: 'The email is invalid.' });

	try {
		const user = await userModels.findOne({ email: email });
		if (!user) return res.status(400).json({ message: 'The email is not registered in our system.' });

		if (!bcrypt.compareSync(password, user.password)) return res.status(400).json({ message: 'The password is incorrect.' });

		// set session
		user.password = undefined;
		user.limit = undefined;
		req.session.user = user;
		if (remember) req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;

		return res.status(200).json({ message: 'Login Success!' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// [DELETE] admin/logout
const logoutHandler = (req, res) => {
	req.session.destroy((err) => {
		if (err) return res.status(500).json({ message: err.message });
		return res.status(200).json({ message: 'Logout Success.' });
	});
};

// ###### PAGE ######

// [GET] admin/login
const login = (req, res) => {
	res.render('admin/login', {
		messageError: '',
	});
};

module.exports = { login, loginHandler, logoutHandler };
