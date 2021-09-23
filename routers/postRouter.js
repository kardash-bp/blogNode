const express = require('express')
const router = express.Router()
const Post = require('../models/post')

router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    res.render('post', { post: post })
  } catch (err) {
    console.log(err.message)
  }
})

module.exports = router
