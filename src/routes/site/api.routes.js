const { Router } = require('express');
const router = Router();

const { searchApiController, reportErrorEpisodeApiController, loadEpisodeApiController } = require('../../controllers/site/api');

// API
router.post('/search', searchApiController);
router.post('/report-error-episode', reportErrorEpisodeApiController);
router.post('/loadEpisode', loadEpisodeApiController);

module.exports = router;
