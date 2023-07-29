const { Router } = require('express');
const router = Router();

const {
	userNotificationApiControllers: { getAllNotification, readNotification, readAllNotification },
} = require('../../../controllers/site/api');

// API
router.get('/', getAllNotification);
router.patch('/read/all', readAllNotification);
router.patch('/read/:notifyId', readNotification);

module.exports = router;
