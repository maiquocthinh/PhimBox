const userModels = require('../models/user.models');
const roleModels = require('../models/role.models');
const userRoleModels = require('../models/userRole.models');
const PERMISSION = require('../config/permission.config');

const auth = async (req, res, next) => {
	const { user } = req.session;

	if (user) {
		const _user = await userModels.findOne({ user_email: user.user_email }, { id: 1 });
		if (_user) next();
		else res.redirect('/admin/login');
	} else res.redirect('/admin/login');
};

const checkPermission = (permission) => {
	return async (req, res, next) => {
		try {
			const { user } = req.session;

			// get userRole
			const userRole = await userRoleModels.findOne({ userId: user._id });
			if (!userRole) return res.status(403).json({ message: 'You have not permission' });

			// get role of user
			const role = await roleModels.findById(userRole.roleId);

			// check can user access into cpanel admin
			if (!role?.permissions?.includes(PERMISSION['view dashboard']))
				// logout & go to login page
				req.session.destroy((err) => {
					if (err) return res.status(500).json({ message: err.message });
					res.redirect('/admin/login', 403);
				});

			// check user permission
			if (!role?.permissions?.includes(permission)) return res.status(403).json({ message: 'You have not permission' });

			// go to next middleware
			next();
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: 'Internal Server Error' });
		}
	};
};

const limitResetPassword = async (req, res, next) => {
	const REQUEST_LIMIT_PER_HOUR = 3;
	const { email } = req.body;
	const { limit: { timesResetPassword } = {} } = await userModels.findOne({ email }, { limit: 1 });

	const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
	const requestsInOneHour = timesResetPassword?.filter((time) => new Date(time) > oneHourAgo) || [];

	if (requestsInOneHour?.length < REQUEST_LIMIT_PER_HOUR) {
		await userModels.findOneAndUpdate({ email }, { 'limit.timesResetPassword': [...requestsInOneHour, Date.now()] });
		return next();
	} else {
		return res
			.status(429)
			.json({ msg: `Passwords are reset only ${REQUEST_LIMIT_PER_HOUR} times per hour. Please try again later.` });
	}
};

module.exports = {
	auth,
	checkPermission,
	limitResetPassword,
};
