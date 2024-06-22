const News = require('../models/news');

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

exports.createNews = async (req, res) => {  
  try {
    const newNewsData = req.body;

    const newNews = new News(newNewsData);
    await newNews.save();

    res.status(201).json(newNews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

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