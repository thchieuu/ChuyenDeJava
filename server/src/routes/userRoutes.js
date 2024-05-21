const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');

// Chỉ admin mới được phép xem danh sách người dùng
router.get('/', authMiddleware.requireAuth, authMiddleware.requireRole('admin'), userController.getUsers);
router.get('/:id', authMiddleware.requireAuth, userController.getUserById);
router.post('/', authMiddleware.requireAuth, authMiddleware.requireRole('admin'), userController.createUser);
router.put('/:id', authMiddleware.requireAuth, userController.updateUser);
router.delete('/:id', authMiddleware.requireAuth, userController.deleteUser);


module.exports = router;