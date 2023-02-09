const User = require('../models/user.models');

const authRequire = (req, res, next) => {
	if (!req.cookies._id) {
		if (req.route.path !== '/login') {
			return res.redirect('/admin/login');
		} else {
			next();
		}
	}
	User.findOne({ _id: req.cookies._id })
		.then((data) => {
			if (req.route.path === '/login') {
				return res.redirect('/admin/dashboard');
			} else {
				req.user = data;
				next();
			}
		})
		.catch(() => {
			if (req.route.path !== '/login') {
				return res.redirect('/admin/login');
			} else {
				next();
			}
		});
};

const auth = async (req, res, next) => {
	const { user } = req.session;

	if (user) {
		const _user = await User.findOne({ user_email: user.user_email });
		if (_user) next();
		else res.redirect('/admin/login');
	} else res.redirect('/admin/login');
};

module.exports = {
	authRequire,
	auth,
};
