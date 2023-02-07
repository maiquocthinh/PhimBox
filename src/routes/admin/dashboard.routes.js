const { Router } = require('express');
const router = Router();
const authMiddleware = require('../../middlewares/auth.middleware');
const dashboardController = require('../../controllers/admin/dashboard.controller');

// PAGE
router.get('/dashboard', authMiddleware.authRequire, dashboardController.dashboard);

module.exports = router;
