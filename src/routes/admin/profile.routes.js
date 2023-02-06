const { Router } = require('express');
const router = Router();
const authMiddleware = require('../../app/middlewares/auth.middleware');
const profileController = require('../../app/controllers/admin/profile.controller');

router.get('/profile', authMiddleware.authRequire, profileController.profile);

module.exports = router;
