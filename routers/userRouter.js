const express = require('express')
const router = express.Router()
const Post = require('../models/post')
const User = require('../models/user')

router.get('/add', (req, res) => {
  res.render('addUser')
})
router.post('/add', async (req, res) => {
  console.log(req.body)
  try {
    res.redirect('/')
  } catch (err) {
    console.log(err.message)
  }
})
module.exports = router
