const express = require('express');
const router = express.Router();

const {
	homeController,
	infoController,
	watchController,
	searchController,
	categoryController,
	countryController,
	catalogueController,
	filterController,
	tagController,
	profileController,
} = require('../../controllers/site');

const apiRoutes = require('./api');

// API
router.use('/api', apiRoutes);

// PAGE
router.get('/info/:filmSlug-:filmId([A-Za-z0-9]+[A-Za-z0-9_]+)', infoController);
router.get('/watch/:filmSlug-:filmId([A-Za-z0-9]+[A-Za-z0-9_]+)/:episodeId?', watchController);
router.get('/search/:keyWord', searchController);
router.get('/category/:categorySlug', categoryController);
router.get('/country/:countrySlug', countryController);
router.get('/catalogue/filter', filterController);
router.get('/catalogue/:type', catalogueController);
router.get('/tag/:tagAscii', tagController);
router.get('/profile', profileController);

router.get('/', homeController);

module.exports = router;
