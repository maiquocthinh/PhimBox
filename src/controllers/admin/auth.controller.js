const Users = require('../../models/user.models');

// [GET] admin/login
const login = (req, res) => {
	res.render('admin/login', {
		messageError: '',
	});
};

// [POST] admin/login
const loginHandler = (req, res) => {
	Users.findOne({ user_mail: req.body.user_mail })
		.then((data) => {
			if (req.body.password !== data.user_pass) {
				res.render('admin/login', {
					messageError: 'Mail or Password Wrong !!!',
				});
				return;
			}
			res.cookie('_id', data._id.toString(), { maxAge: 3 * 3600 * 1000 });
			res.redirect('/admin/dashboard');
		})
		.catch((error) => {
			res.status(500).json({ error: error.message });
		});
};

// [GET] admin/logout
const logout = (req, res) => {
	res.clearCookie('_id');
	res.redirect('./login');
};

module.exports = { login, loginHandler, logout };
