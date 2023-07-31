const userModels = require('../models/user.models');
const PERMISSION = require('../config/permission.config');
const { userStatus } = require('../config/constants');

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
			const { _id: userId } = req.session.user || {};

			// get role of user
			const [user] = await userModels.aggregate([
				{ $match: { _id: userId } },
				{
					$lookup: {
						from: 'roles',
						localField: 'roleId',
						foreignField: '_id',
						as: 'role',
					},
				},
				{ $unwind: '$role' },
				{ $project: { status: 1, role: { permissions: 1 } } },
			]);

			if (user.status === userStatus.BANNED) return res.status(403).json({ message: 'This account have been banned.' });

			if (!user?.role) return res.status(403).json({ message: 'You have not permission' });

			const role = user.role;

			// check can user access into control panel admin
			if (!role?.permissions?.includes(PERMISSION['view dashboard'])) {
				// logout & go to login page
				await new Promise((resolve, reject) => {
					req.session.destroy((err) => {
						if (err) return reject(err);
						return resolve();
					});
				});
				return res.redirect('/admin/login');
			}

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
	const REQUEST_LIMIT_PER_DAY = 3;
	const { email } = req.body;
	const { limit: { timesResetPassword } = {} } = await userModels.findOne({ email }, { limit: 1 });

	const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
	const requestsInOneDay = timesResetPassword?.filter((time) => new Date(time) > oneDayAgo) || [];

	if (requestsInOneDay?.length < REQUEST_LIMIT_PER_DAY) {
		await userModels.findOneAndUpdate({ email }, { 'limit.timesResetPassword': [...requestsInOneDay, Date.now()] });
		return next();
	} else {
		return res
			.status(429)
			.json({ msg: `Passwords are reset only ${REQUEST_LIMIT_PER_DAY} times per day. Please try again later.` });
	}
};

module.exports = {
	auth,
	checkPermission,
	limitResetPassword,
};
