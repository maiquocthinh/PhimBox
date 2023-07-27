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
	profileControllers: { privateProfileController, publicProfileController },
} = require('../../controllers/site');
const apiRoutes = require('./api');

const updateView = require('../../middlewares/updateView.middleware');

// API
router.use('/api', apiRoutes);

// PAGE
router.get('/info/:filmSlug-:filmId([A-Za-z0-9]+[A-Za-z0-9_]+)', infoController);
router.get('/watch/:filmSlug-:filmId([A-Za-z0-9]+[A-Za-z0-9_]+)/:episodeId?', watchController, updateView);
router.get('/search/:keyWord', searchController);
router.get('/category/:categorySlug', categoryController);
router.get('/country/:countrySlug', countryController);
router.get('/catalogue/filter', filterController);
router.get('/catalogue/:type', catalogueController);
router.get('/tag/:tagAscii', tagController);
router.get('/profile', privateProfileController);
router.get('/profile/:username', publicProfileController);

router.get('/', homeController);

module.exports = router;
