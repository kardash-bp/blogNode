const express = require('express')
const router = express.Router()
const Post = require('../models/post')

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 })
    posts.forEach((el) => {})
    res.render('index', { posts: posts })
  } catch (err) {
    console.log(err.message)
  }
})

router.get('/contact', (req, res) => {
  res.render('contact')
})
module.exports = router
