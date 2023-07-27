const { Router } = require('express');
const {
	userFilmsApiController: { getHistory, deleteHistory },
} = require('../../../controllers/site/api');
const router = Router();

// API
router.get('/history', getHistory);
router.delete('/history/:epId', deleteHistory);

module.exports = router;
