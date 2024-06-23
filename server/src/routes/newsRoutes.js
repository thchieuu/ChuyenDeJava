const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const authMiddleware = require('../middlewares/auth');

// Yêu cầu xác thực và vai trò 'editor' cho các route sau
router.post('/', authMiddleware.requireAuth, authMiddleware.requireRole('admin'), newsController.createNews);
router.put('/:id', authMiddleware.requireAuth, authMiddleware.requireRole('admin'), newsController.updateNewsById);
router.delete('/:id', authMiddleware.requireAuth, authMiddleware.requireRole('admin'), newsController.deleteNewsById);

// Route lấy danh sách và chi tiết bài viết không yêu cầu quyền
router.get('/', newsController.getNews);
router.get('/search', newsController.searchNews);
router.get('/:id', newsController.getNewsById);
router.get('/type/:type', newsController.getNewsByType);


module.exports = router;