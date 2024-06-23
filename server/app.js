require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const newsRoutes = require('./src/routes/newsRoutes');
const commentRoutes = require('./src/routes/commentRoutes');
const leagueRoutes = require('./src/routes/leagueRoutes');

const app = express();

// Kết nối database
mongoose.connect('mongodb://127.0.0.1:27017/news', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
    .then(() => console.log('Kết nối database thành công'))
    .catch(err => console.error('Lỗi kết nối database:', err));

// Sử dụng middleware
app.use(cors());
app.use(express.json());

// Sử dụng route
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api', leagueRoutes);

// Khởi động server
const port = process.env.PORT || 7000;
app.listen(port, () => console.log(`Server đang chạy trên cổng ${port}`));