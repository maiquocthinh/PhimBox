const loadHeaderData = require('../../utils/site/loadHeaderData.utils');

module.exports = async (req, res) => {
	// check user
	if (!req.session.user) return res.redirect('/');

	const header = await loadHeaderData.load();

	res.render('site/profile', {
		header,
		user: req.session.user,
	});
};
