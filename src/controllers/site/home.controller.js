const loadHeaderData = require('../../utils/site/loadHeaderData.utils');
const loadHomeData = require('../../utils/site/loadHomeData.util');
const loadRightSidebarData = require('../../utils/site/loadRightSidebarData.util');

module.exports = async (req, res) => {
	const [header, rightSidebar, home] = await Promise.all([
		loadHeaderData.load(),
		loadRightSidebarData.load(),
		loadHomeData.load(),
	]);

	res.render('site/home', {
		header,
		home,
		rightSidebar,
	});
};
