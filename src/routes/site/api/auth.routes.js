const { Router } = require('express');
const router = Router();

const { limitResetPassword } = require('../../../middlewares/auth.middleware');
const {
	authApiController: { registerController, loginController, logoutController, forgotPasswordController },
} = require('../../../controllers/site/api');

// API
router.post('/register', registerController);
router.post('/login', loginController);
router.post('/forgot-password', limitResetPassword, forgotPasswordController);
router.delete('/logout', logoutController);

module.exports = router;
