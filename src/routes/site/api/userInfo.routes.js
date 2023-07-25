const { Router } = require('express');
const router = Router();

const { updateInfoController } = require('../../../controllers/site/api/userInfo.api.controller');
const { limitChangeInfo } = require('../../../middlewares/userInfo.middleware');

// API
router.post('/update-info', limitChangeInfo, updateInfoController);

module.exports = router;
