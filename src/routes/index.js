const adminRouter = require('./admin.routes');
const siteRouter = require('./site.routes');

const authMiddleware = require('../app/middlewares/auth.middleware');

function routes(app) {

    app.use('/admin', adminRouter);
    app.use('/auth', adminRouter);

    app.use('/', siteRouter);

}
module.exports = routes;