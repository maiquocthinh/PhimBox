const loadHeaderData = require('../../utils/site/loadHeaderData.utils');
const loadHomeData = require('../../utils/site/loadHomeData.util');

module.exports = async (req, res) => {
	res.render('site/home', {
		header: await loadHeaderData.load(),
		home: await loadHomeData.load(),
	});
};
