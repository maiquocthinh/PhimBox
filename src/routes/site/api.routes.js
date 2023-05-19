const { Router } = require('express');
const router = Router();

const { searchApiController, reportErrorEpisodeApiController } = require('../../controllers/site/api');

// API
router.post('/search', searchApiController);
router.post('/report-error-episode', reportErrorEpisodeApiController);

module.exports = router;
