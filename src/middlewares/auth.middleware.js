const User = require('../models/user.models');
const roleModels = require('../models/role.models');
const userRoleModels = require('../models/userRole.models');
const PERMISSION = require('../config/permission.config');

const auth = async (req, res, next) => {
	const { user } = req.session;

	if (user) {
		const _user = await User.findOne({ user_email: user.user_email }, { id: 1 });
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
			if (!role?.permissions?.includes(permission))
				return res.status(403).json({ message: 'You have not permission' });

			// go to next middleware
			next();
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: 'Internal Server Error' });
		}
	};
};

module.exports = {
	auth,
	checkPermission,
};
