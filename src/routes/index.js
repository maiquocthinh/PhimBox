const adminRouter = require('./admin');
const siteRouter = require('./site');
const serviceRouter = require('./service');

const routes = (app) => {
	app.use('/service', serviceRouter);
	app.use('/admin', adminRouter);
	app.use('/', siteRouter);
};

module.exports = routes;
