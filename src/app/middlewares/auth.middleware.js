const User = require('../models/user.models');

function authRequire(req, res, next) {
    if (!req.cookies._id) {
        if (req.route.path !== '/login') {
            return res.redirect('/admin/login');
        }else{
            next();
        }
    }
    User.findOne({ _id: req.cookies._id })
        .then((data) => {
            if (req.route.path === '/login') {
                return res.redirect('/admin/dashboard');
            } else {
                req.user = data;
                next();
            }
        })
        .catch(() => {
            if (req.route.path !== '/login') {
                return res.redirect('/admin/login');
            }else{
                next();
            }
        });
};

module.exports = {
    authRequire,
}