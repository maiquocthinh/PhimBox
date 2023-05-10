const { Router } = require('express');
const router = Router();

const { searchApiController } = require('../../controllers/site/api');

// API
router.post('/search', searchApiController);

module.exports = router;
