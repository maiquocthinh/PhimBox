const userModels = require('../../models/user.models');
const configurationModels = require('../../models/configuration.models');
const loadHeaderData = require('../../utils/site/loadHeaderData.utils');
const getNotificationOfUser = require('../../helpers/getNotificationOfUser.helper');
const { userStatus } = require('../../config/constants');

const privateProfileController = async (req, res) => {
	const BASE_URL = await configurationModels.findOne({}, { web_url: 1 }).then(({ web_url }) => web_url);
	const { _id: userId } = req.session.user || {};

	// check user
	if (!userId) return res.redirect('/');

	const [header, notifications] = await Promise.all([loadHeaderData.load(), userId && getNotificationOfUser(userId)]);

	res.render('site/profile', {
		header: { ...header, notifications },
		user: req.session.user,
		profile: { ...req.session.user, isPrivate: true },
		BASE_URL,
	});
};

const publicProfileController = async (req, res) => {
	const BASE_URL = await configurationModels.findOne({}, { web_url: 1 }).then(({ web_url }) => web_url);
	const { _id: userId } = req.session.user || {};
	const { username } = req.params;

	if (!username) return res.status(404).json({ msg: 'Page not found!' });

	// check user
	const user = await userModels.findOne({ username }, { password: 0, limit: 0, films: 0 });
	if (!user) return res.status(404).json({ msg: 'Page not found!' });

	const [header, notifications] = await Promise.all([loadHeaderData.load(), userId && getNotificationOfUser(userId)]);

	res.render('site/profile', {
		header: { ...header, notifications },
		user: req.session.user,
		profile: { ...user._doc, isPrivate: false, isBanned: user.status === userStatus.BANNED },
		BASE_URL,
	});
};

module.exports = { privateProfileController, publicProfileController };
