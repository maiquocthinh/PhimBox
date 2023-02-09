const { Router } = require('express');
const router = Router();
const authController = require('../../controllers/admin/auth.controller');

// API
router.post('/login', authController.loginHandler);
router.delete('/logout', authController.logoutHandler);
// PAGE
router.get('/login', authController.login);

module.exports = router;
