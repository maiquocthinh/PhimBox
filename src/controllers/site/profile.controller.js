const userModels = require('../../models/user.models');
const configurationModels = require('../../models/configuration.models');
const loadHeaderData = require('../../utils/site/loadHeaderData.utils');

const privateProfileController = async (req, res) => {
	const BASE_URL = await configurationModels.findOne({}, { web_url: 1 }).then(({ web_url }) => web_url);

	// check user
	if (!req.session.user) return res.redirect('/');

	const header = await loadHeaderData.load();

	res.render('site/profile', {
		header,
		user: req.session.user,
		profile: { ...req.session.user, isPrivate: true },
		BASE_URL,
	});
};

const publicProfileController = async (req, res) => {
	const BASE_URL = await configurationModels.findOne({}, { web_url: 1 }).then(({ web_url }) => web_url);
	const { username } = req.params;

	if (!username) return res.status(404).json({ msg: 'Page not found!' });

	// check user
	const user = await userModels.findOne({ username });
	if (!user) return res.status(404).json({ msg: 'Page not found!' });

	const header = await loadHeaderData.load();

	res.render('site/profile', {
		header,
		user: req.session.user,
		profile: { ...user._doc, isPrivate: false },
		BASE_URL,
	});
};

module.exports = { privateProfileController, publicProfileController };
