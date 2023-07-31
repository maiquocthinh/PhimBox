const { userStatus } = require('../config/constants');
const userModels = require('../models/user.models');

module.exports = async (req, res, next) => {
	const { username } = req.session.user || {};

	// check user banned
	if (username) {
		const user = await userModels.findOne({ username }, { status: 1 });
		if (user?.status === userStatus.BANNED)
			return res.status(403).json({ msg: 'This account have been banned. Contact admin for help.' });
	}

	return next();
};
