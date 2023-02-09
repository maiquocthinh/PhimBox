const Users = require('../../models/user.models');
const { validateEmail } = require('../../utils');

// ###### API ######

// [POST] admin/login
const loginHandler = async (req, res) => {
	const { email, password, remember } = req.body;

	if (!email || !password)
		return res.status(400).render('admin/login', {
			messageError: 'You must enter all fields.',
		});

	if (!validateEmail(email))
		return res.status(400).render('admin/login', {
			messageError: 'The email is invalid.',
		});

	try {
		const user = await Users.findOne({ user_mail: email });

		if (!user)
			return res.status(400).render('admin/login', {
				messageError: 'The email is not registered in our system.',
			});

		if (password !== user.user_pass)
			return res.status(400).render('admin/login', {
				messageError: 'The password is incorrect.',
			});

		user.user_pass = undefined;
		req.session.user = user;
		if (remember) req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;
		res.redirect('/admin/dashboard');
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// [DELETE] admin/logout
const logoutHandler = (req, res) => {
	req.session.destroy();
	res.status(200).json({ msg: 'logout success.' });
};

// ###### PAGE ######

// [GET] admin/login
const login = (req, res) => {
	res.render('admin/login', {
		messageError: '',
	});
};

module.exports = { login, loginHandler, logoutHandler };
