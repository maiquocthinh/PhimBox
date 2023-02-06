const { Router } = require('express');
const router = Router();
const authMiddleware = require('../../app/middlewares/auth.middleware');
const authController = require('../../app/controllers/admin/auth.controller');

router.get('/login', authMiddleware.authRequire, authController.login);
router.post('/login', authController.loginHandler);
router.get('/logout', authController.logout);

module.exports = router;
