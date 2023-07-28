const { Router } = require('express');
const {
	userFilmsApiControllers: {
		getHistory,
		deleteFromHistory,
		getCollection,
		addIntoCollection,
		deleteFromCollection,
		getAllFollow,
		follow,
		unfollow,
	},
} = require('../../../controllers/site/api');
const router = Router();

// API
router.get('/history', getHistory);
router.delete('/history/:epId', deleteFromHistory);
router.get('/collection', getCollection);
router.post('/collection', addIntoCollection);
router.delete('/collection/:filmId', deleteFromCollection);
router.get('/follow', getAllFollow);
router.post('/follow', follow);
router.delete('/follow/:filmId', unfollow);

module.exports = router;
