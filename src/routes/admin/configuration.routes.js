const { Router } = require('express');
const router = Router();
const authMiddleware = require('../../middlewares/auth.middleware');
const configurationController = require('../../controllers/admin/configuration.controller');
const PERMISSION = require('../../config/permission.config');

// API
router.patch(
	'/update',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['configuration']),
	configurationController.configurationUpdate,
);
// PAGE
router.get(
	'/',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['configuration']),
	configurationController.configuration,
);

module.exports = router;
