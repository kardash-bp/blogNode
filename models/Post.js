const mongoose = require('mongoose')

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, minlength: 3 },
    published: { type: Boolean, required: true, default: false },
    category: ['react', 'node'],
    body: String,
    imageUrl: String,
    date: { type: Date, default: Date.now },
  },
  { timestamp: true }
)
module.exports = mongoose.model('Post', postSchema)
