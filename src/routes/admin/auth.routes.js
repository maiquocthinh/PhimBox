const { Router } = require('express');
const router = Router();
const authMiddleware = require('../../middlewares/auth.middleware');
const authController = require('../../controllers/admin/auth.controller');

// API
router.post('/login', authController.loginHandler);
router.get('/logout', authController.logout);
// PAGE
router.get('/login', authMiddleware.authRequire, authController.login);

module.exports = router;
