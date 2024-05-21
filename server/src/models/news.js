const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  author: { type: String },
  description: { type: String },
  dateTime: { type: String },
  isoTime: { type: Date },
  mainText: [String],
  imgLinks: [{
    url: { type: String, required: true },
    title: { type: String },
    type: { type: String, enum: ['image', 'video'] },
  }],
});

module.exports = mongoose.model('News', newsSchema);