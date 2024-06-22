const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({

  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true, unique: true, minlength: 3, maxlength: 20 },
  news: { type: mongoose.Schema.Types.ObjectId, ref: 'News', required: true },
  createdAt: { type: Date, default: Date.now },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
});

module.exports = mongoose.model('Comment', commentSchema);