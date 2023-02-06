const { Router } = require('express');
const router = Router();
const authMiddleware = require('../../app/middlewares/auth.middleware');
const dashboardController = require('../../app/controllers/admin/dashboard.controller');

router.get('/dashboard', authMiddleware.authRequire, dashboardController.dashboard);

module.exports = router;
