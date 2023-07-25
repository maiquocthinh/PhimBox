const { Router } = require('express');
const router = Router();

const { limitForgotPassword } = require('../../../middlewares/auth.middleware');
const {
	authApiController: { registerController, loginController, logoutController, forgotPasswordController },
} = require('../../../controllers/site/api');

// API
router.post('/register', registerController);
router.post('/login', loginController);
router.post('/forgot-password', limitForgotPassword, forgotPasswordController);
router.delete('/logout', logoutController);

module.exports = router;
