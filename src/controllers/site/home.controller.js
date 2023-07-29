const loadHeaderData = require('../../utils/site/loadHeaderData.utils');
const loadHomeData = require('../../utils/site/loadHomeData.util');
const loadRightSidebarData = require('../../utils/site/loadRightSidebarData.util');
const getNotificationOfUser = require('../../helpers/getNotificationOfUser.helper');

module.exports = async (req, res) => {
	const { _id: userId } = req.session.user || {};

	const [header, rightSidebar, home, notifications] = await Promise.all([
		loadHeaderData.load(),
		loadRightSidebarData.load(),
		loadHomeData.load(),
		userId && getNotificationOfUser(userId),
	]);

	res.render('site/home', {
		header: { ...header, notifications },
		home,
		rightSidebar,
		user: req.session.user,
	});
};
