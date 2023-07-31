const adminRouter = require('./admin');
const siteRouter = require('./site');
const checkBannedUser = require('../middlewares/checkBannedUser.middleware');

const routes = (app) => {
	app.use('/admin', adminRouter);
	app.use('/', checkBannedUser, siteRouter);
};

module.exports = routes;
