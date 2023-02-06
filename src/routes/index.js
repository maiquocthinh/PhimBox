const adminRouter = require('./admin');
const siteRouter = require('./site.routes');

function routes(app) {
	app.use('/admin', adminRouter);
	app.use('/', siteRouter);
}

module.exports = routes;
