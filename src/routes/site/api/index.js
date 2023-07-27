const { Router } = require('express');
const router = Router();

const {
	searchApiController,
	reportErrorEpisodeApiController,
	loadEpisodeApiController,
} = require('../../../controllers/site/api');

const authRoutes = require('./auth.routes');
const userInfoRoutes = require('./userInfo.routes');
const userFilmsRoutes = require('./userFilms.routes');
const updateViewHistoryMiddleware = require('../../../middlewares/updateViewHistory.middleware');

// API
router.post('/search', searchApiController);
router.post('/report-error-episode', reportErrorEpisodeApiController);
router.post('/loadEpisode', updateViewHistoryMiddleware, loadEpisodeApiController);
router.use('/auth', authRoutes);
router.use('/info', userInfoRoutes);
router.use('/films', userFilmsRoutes);

module.exports = router;
