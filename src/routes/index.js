const adminRouter = require('./admin');
const siteRouter = require('./site.routes');

const routes = (app) => {
	app.use('/admin', adminRouter);
	app.use('/', siteRouter);
};

module.exports = routes;
