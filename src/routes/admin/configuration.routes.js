const { Router } = require('express');
const router = Router();
const authMiddleware = require('../../middlewares/auth.middleware');
const configurationController = require('../../controllers/admin/configuration.controller');

// API
router.patch('/update', authMiddleware.auth, configurationController.configurationUpdate);
// PAGE
router.get('/', authMiddleware.auth, configurationController.configuration);

module.exports = router;
