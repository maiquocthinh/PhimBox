const { Router } = require('express');
const router = Router();

const adminController = require('../../controllers/admin');
const authMiddleware = require('../../middlewares/auth.middleware');

const authRoutes = require('./auth.routes');
const dashboardRoutes = require('./dashboard.routes');
const profileRoutes = require('./profile.routes');
const filmsRoutes = require('./films.routes');
const categoriesRoutes = require('./categories.routes');
const countriesRoutes = require('./countries.routes');
const usersRoutes = require('./users.routes');
const configurationRoutes = require('./configuration.routes');

// auth
router.use(authRoutes);

// dashboard
router.use(dashboardRoutes);

//profile
router.use(profileRoutes);

// films
router.use('/films', filmsRoutes);
// category

router.use('/categories', categoriesRoutes);
// country

router.use('/countries', countriesRoutes);

// users
router.use('/users', usersRoutes);

// configs
router.use('/configuration', configurationRoutes);

// admin home
router.get('/', authMiddleware.auth, adminController.admin);

module.exports = router;
