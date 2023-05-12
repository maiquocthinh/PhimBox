const express = require('express');
const router = express.Router();

const {
	homeController,
	infoController,
	watchController,
	searchController,
	categoryController,
	countryController,
} = require('../../controllers/site');

const apiRoutes = require('./api.routes');

router.get('/info/:filmSlug', infoController);
router.get('/watch/:filmId', watchController);
router.use('/api', apiRoutes);

router.get('/search/:keyWord/:page?', searchController);
router.get('/category/:categorySlug/:page?', categoryController);
router.get('/country/:countrySlug/:page?', countryController);

router.get('/', homeController);

module.exports = router;
