const express = require('express')
const router = express.Router()
const Post = require('../models/Post')

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
    posts.forEach((el) => {})
    res.render('index', { posts: posts })
  } catch (err) {
    console.log(err.message)
  }
})

module.exports = router
