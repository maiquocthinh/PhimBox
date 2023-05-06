const express = require('express');
const router = express.Router();

const { homeController, infoController, watchController, catalogueController } = require('../../controllers/site');

router.get('/info/:filmId', infoController);
router.get('/watch/:filmId', watchController);
router.get('/catalogue', catalogueController);
router.get('/', homeController);

module.exports = router;
