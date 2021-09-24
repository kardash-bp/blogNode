const express = require('express')
const router = express.Router()
const User = require('../models/user')
const {
  userValidationRules,
  loginValidationRules,
  validate,
} = require('../middleware/validator')
router.get('/add', (req, res) => {
  res.render('register')
})
router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})
router.get('/login', (req, res) => {
  res.render('login')
})
router.post('/login', loginValidationRules(), validate, async (req, res) => {
  if (req.body?.errors?.length > 0) {
    console.log(req.body)

    return res.render('login', { errors: req.body.errors })
  }
  try {
    const user = await User.findOne({ username: req.body.username })
    if (user && user.password === req.body.password) {
      req.session.user = user
      res.redirect('/')
    }
  } catch (err) {
    console.log(err.message)
  }
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
