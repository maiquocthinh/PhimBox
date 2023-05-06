const adminRouter = require('./admin');
const siteRouter = require('./site');

const routes = (app) => {
	app.use('/admin', adminRouter);
	app.use('/', siteRouter);
};

module.exports = routes;
