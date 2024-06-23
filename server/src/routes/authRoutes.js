const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/check-username', authController.checkUsername);
router.post('/check-email', authController.checkEmail);
router.get('/protected-route', authController.verifyToken, (req, res) => {
    res.json({ message: 'This is a protected route' });
});
module.exports = router;