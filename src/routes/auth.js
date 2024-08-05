const express = require('express');
const authController = require('../controllers/handleAuth');


const router = express.Router();

router.post('/new-user',authController.signUp);
router.post('/verify-account',authController.verifyEmail);
router.post('/login-user',authController.login);

module.exports = router;