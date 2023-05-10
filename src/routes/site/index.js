const express = require('express');
const router = express.Router();

const { homeController, infoController, watchController, catalogueController } = require('../../controllers/site');

const apiRoutes = require('./api.routes');

router.get('/info/:filmSlug', infoController);
router.get('/watch/:filmId', watchController);
router.get('/catalogue', catalogueController);
router.use('/api', apiRoutes);
router.get('/', homeController);

module.exports = router;
