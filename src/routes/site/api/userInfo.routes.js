const { Router } = require('express');
const router = Router();

const {
	userInfoApiController: { updateInfoController, updateAvatarController },
} = require('../../../controllers/site/api');
const { limitChangeInfo, limitChangeAvatar } = require('../../../middlewares/userInfo.middleware');

// API
router.post('/update-info', limitChangeInfo, updateInfoController);
router.post('/update-avatar', limitChangeAvatar, updateAvatarController);

module.exports = router;
