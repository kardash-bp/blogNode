const express = require('express')
const router = express.Router()
const Post = require('../models/post')
const User = require('../models/user')
const { userValidationRules, validate } = require('../middleware/validator')
router.get('/add', (req, res) => {
  res.render('register')
})
router.get('/login', (req, res) => {
  res.render('login')
})
router.post('/login', (req, res) => {
  res.redirect('/')
})
router.post('/add', userValidationRules(), validate, async (req, res) => {
  if (req.body?.errors?.length > 0) {
    return res.render('register', { errors: req.body.errors })
  }
  try {
    const user = await User.create(req.body)

    req.flash('success', 'You are registered, please login.')
    res.redirect('/user/login')
  } catch (err) {
    console.log(err.message)
    res.render('register', { err: 'Email already exists in db.' })
  }
})
module.exports = router
