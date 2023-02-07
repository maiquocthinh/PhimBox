const { Router } = require('express');
const router = Router();
const authMiddleware = require('../../middlewares/auth.middleware');
const configurationController = require('../../controllers/admin/configuration.controller');

// API
router.patch('/update', authMiddleware.authRequire, configurationController.configurationUpdate);
// PAGE
router.get('/', authMiddleware.authRequire, configurationController.configuration);

module.exports = router;
