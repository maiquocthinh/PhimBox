const { Router } = require('express');
const router = Router();
const authMiddleware = require('../../app/middlewares/auth.middleware');
const configurationController = require('../../app/controllers/admin/configuration.controller');

router.get('/', authMiddleware.authRequire, configurationController.configuration);
router.patch('/update', authMiddleware.authRequire, configurationController.configurationUpdate);

module.exports = router;
