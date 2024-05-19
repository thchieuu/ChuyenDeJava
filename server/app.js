require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();

// Kết nối database
mongoose.connect('mongodb://127.0.0.1:27017/news', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Kết nối database thành công'))
.catch(err => console.error('Lỗi kết nối database:', err));


// Khởi động server
const port = process.env.PORT || 7000;
app.listen(port, () => console.log(`Server đang chạy trên cổng ${port}`));