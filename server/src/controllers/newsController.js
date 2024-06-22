const News = require('../models/news');
const multer = require('multer');
const path = require('path');

exports.getNews = async (req, res) => {
  try {
    const newsList = await News.find();
    res.json(newsList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.getNewsById = async (req, res) => {
  try {
    const newsId = req.params.id;
    const news = await News.findById(newsId);

    if (!news) {
      return res.status(404).json({ message: 'Không tìm thấy bài viết' });
    }

    res.json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.updateNewsById = async (req, res) => {
  try {
    const newsId = req.params.id;
    const updates = req.body;

    const updatedNews = await News.findByIdAndUpdate(newsId, updates, { new: true });

    if (!updatedNews) {
      return res.status(404).json({ message: 'Không tìm thấy bài viết' });
    }

    res.json("Update thành công" + updates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.deleteNewsById = async (req, res) => {
  try {
    const newsId = req.params.id;

    const deletedNews = await News.findByIdAndDelete(newsId);

    if (!deletedNews) {
      return res.status(404).json({ message: 'Không tìm thấy bài viết' });
    }

    res.json({ message: 'Bài viết đã được xóa' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Cấu hình multer để xử lý file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Thư mục lưu trữ file
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) // Đặt tên file
  }
});

const upload = multer({ storage: storage });

exports.createNews = [
  upload.array('images', 5),
  async (req, res) => {
    try {
      const newNewsData = JSON.parse(JSON.stringify(req.body));
      
      // Xử lý imgLinks
      const imgLinks = JSON.parse(newNewsData.imgLinks);
      const updatedImgLinks = imgLinks.map((link, index) => {
        if (link.type === 'image' && req.files[index]) {
          return {
            ...link,
            url: `/uploads/${req.files[index].filename}`
          };
        }
        return link;
      });

      // Cập nhật newNewsData với imgLinks đã xử lý
      newNewsData.imgLinks = updatedImgLinks;

      // Chuyển đổi mainText từ string sang array nếu cần
      if (typeof newNewsData.mainText === 'string') {
        newNewsData.mainText = JSON.parse(newNewsData.mainText);
      }

      const newNews = new News(newNewsData);
      await newNews.save();

      res.status(201).json(newNews);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  }
];

exports.searchNews = async (req, res) => {
  try {
    const searchTerm = req.query.q; // Lấy từ khóa tìm kiếm từ query string

    // Xây dựng query tìm kiếm
    const query = {
      title: { $regex: searchTerm, $options: 'i' } // Tìm kiếm không phân biệt hoa thường
    };

    const newsList = await News.find(query);

    if (newsList.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy kết quả' });
    }

    res.json(newsList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};