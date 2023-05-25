const { Router } = require('express');
const router = Router();

const {
	searchApiController,
	reportErrorEpisodeApiController,
	loadEpisodeVideoApiController,
} = require('../../controllers/site/api');

// API
router.post('/search', searchApiController);
router.post('/report-error-episode', reportErrorEpisodeApiController);
router.post('/loadEpisodeVideo', loadEpisodeVideoApiController);

module.exports = router;
