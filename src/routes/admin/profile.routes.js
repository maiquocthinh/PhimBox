const { Router } = require('express');
const router = Router();
const authMiddleware = require('../../middlewares/auth.middleware');
const profileController = require('../../controllers/admin/profile.controller');

// PAGE
router.get('/profile', authMiddleware.auth, profileController.profile);

module.exports = router;
