const { Router } = require('express');
const router = Router();

const { registerController, loginController, logoutController } = require('../../../controllers/site/api/auth.api.controller');

// API
router.post('/register', registerController);
router.post('/login', loginController);
router.delete('/logout', logoutController);

module.exports = router;
