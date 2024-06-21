const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middlewares/auth');

// Lấy comment
router.get('/', commentController.getComments);

// Lấy danh sách comment cho bài viết
router.get('/:newsId', commentController.getCommentsByNewsId);

// Thêm comment mới
router.post('/', authMiddleware.requireAuth, commentController.createComment);

//Thích/Bỏ thích comment
router.post('/:commentId/like', authMiddleware.requireAuth, commentController.toggleLike);

//Thêm route sửa, xóa comment
router.put('/:commentId', authMiddleware.requireAuth, commentController.updateComment);
router.delete('/:commentId', authMiddleware.requireAuth, commentController.deleteComment);


module.exports = router;