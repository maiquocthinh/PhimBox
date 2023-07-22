const bcrypt = require('bcryptjs');
const userModels = require('../../../models/user.models');
const { validateEmail } = require('../../../utils');

const registerController = async (req, res) => {
	const { fullname, username, email, password } = req.body;

	if (!fullname || !username || !email || !password) return res.status(400).json({ msg: 'Please fill in all fields.' });
	if (fullname.length < 3 || fullname.length > 32)
		return res.status(400).json({ msg: 'Fullname must be between 3 and 32 characters!' });
	if (!validateEmail(email)) return res.status(400).json({ msg: 'The email is invalid.' });
	if (password.length < 6) return res.status(400).json({ msg: 'Password must be at least 6 characters.' });

	try {
		// hash password
		const salt = await bcrypt.genSalt();
		const hashPassword = await bcrypt.hash(password, salt);

		// save new user
		const newUser = new userModels({
			fullname,
			username,
			email,
			password: hashPassword,
		});
		await newUser.save();

		// register success
		res.status(200).json({ msg: 'Register account success!' });
	} catch (error) {
		return res.status(500).json({ msg: error.message });
	}
};

const loginController = async (req, res) => {
	const { email, password, remember } = req.body;

	if (!email || !password) return res.status(400).json({ msg: 'Please fill in all fields.' });
	if (!validateEmail(email)) return res.status(400).json({ msg: 'The email is invalid.' });
	if (password.length < 6) return res.status(400).json({ msg: 'Password must be at least 6 characters.' });

	try {
		// check user
		const user = await userModels.findOne({ email: email });
		if (!user) return res.status(400).json({ msg: 'This email is not registered in the system.' });

		// check password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) return res.status(400).json({ msg: 'This password is incorrect.' });

		// set session
		user.password = undefined;
		req.session.user = user;
		if (remember) req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7; // a week

		// login success
		res.status(200).json({ msg: 'Login Success.' });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ msg: error.message });
	}
};

const logoutController = (req, res) => {
	req.session.destroy((err) => {
		if (err) return res.status(500).json({ msg: err.message });
		return res.status(200).json({ msg: 'Logout Success.' });
	});
};

module.exports = { registerController, loginController, logoutController };
