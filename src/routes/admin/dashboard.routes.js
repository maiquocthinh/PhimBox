const { Router } = require('express');
const router = Router();
const authMiddleware = require('../../middlewares/auth.middleware');
const dashboardController = require('../../controllers/admin/dashboard.controller');
const PERMISSION = require('../../config/permission.config');

// PAGE
router.get(
	'/dashboard',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['view dashboard']),
	dashboardController.dashboard,
);
module.exports = router;
