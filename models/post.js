const mongoose = require('mongoose')

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, minlength: 3 },
    subtitle: { type: String, required: true, minlength: 3 },
    published: { type: Boolean, required: true, default: false },
    category: String,
    text: { type: String, required: true, minlength: 3 },
    imageUrl: String,
    comments: [{ body: String, date: Date }],
    date: { type: Date, default: Date.now },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamp: true }
)
module.exports = mongoose.model('Post', postSchema)
