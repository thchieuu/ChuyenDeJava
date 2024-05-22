const Comment = require('../models/comment');

exports.getCommentsByNewsId = async (req, res) => {
  try {
    const newsId = req.params.newsId;
    const comments = await Comment.find({ news: newsId })
      .populate('author', 'username')
      .sort({ createdAt: -1 })
      .lean();
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.createComment = async (req, res) => {
  try {
    const { content, newsId } = req.body;
    const author = req.user.userId; // Lấy ID người dùng từ token

    const newComment = new Comment({ content, author, news: newsId });
    await newComment.save();

    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.toggleLike = async (req, res) => {
    try {
      const commentId = req.params.commentId;
      const userId = req.user.userId;
  
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ message: 'Không tìm thấy comment' });
      }
  
      // Kiểm tra xem người dùng đã thích chưa
      const isLiked = comment.likes.includes(userId);
  
      // Thêm hoặc xóa ID người dùng khỏi mảng likes
      if (isLiked) {
        comment.likes.pull(userId);
      } else {
        comment.likes.push(userId);
      }
  
      await comment.save();
      res.json({ message: isLiked ? 'Unlike comment' : 'Like comment' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  };

//Thêm hàm xử lý sửa, xóa comment
exports.updateComment = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const userId = req.user.userId;
        const newContent = req.body.content;

        const comment = await Comment.findById(commentId);
        if(!comment) {
            return res.status(404).json({message: "Không tìm thấy comment"});
        }

        if(comment.author.toString() !== userId && req.user.role !== 'admin') {
            return res.status(403).json({message: "Không có quyền truy cập"});
        }

        comment.content = newContent;
        await comment.save();

        res.json(comment);

        } catch (error) {
            console.log(error);
            return res.status(500).json({message: "Lỗi Server"});
        }

};

exports.deleteComment = async (req, res) => {
    try {

        const commentId = req.params.commentId;
        const userId = req.user.userId;

        const comment = await Comment.findById(commentId);
        if(!comment) {
            return res.status(404).json({message: "Không tìm thấy comment"});
        }

        if(comment.author.toString() !== userId && req.user.role !== 'admin') {
            return res.status(403).json({message: "Không có quyền truy cập"});
        }

        await comment.deleteOne();
        res.json({message: "Comment đã được xóa"});

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Lỗi Server"});
    }
};