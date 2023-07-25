const { Router } = require('express');
const router = Router();

const {
	searchApiController,
	reportErrorEpisodeApiController,
	loadEpisodeApiController,
} = require('../../../controllers/site/api');

const authRoutes = require('./auth.routes');
const userInfoRoutes = require('./userInfo.routes');

// API
router.post('/search', searchApiController);
router.post('/report-error-episode', reportErrorEpisodeApiController);
router.post('/loadEpisode', loadEpisodeApiController);
router.use('/auth', authRoutes);
router.use('/info', userInfoRoutes);

module.exports = router;
