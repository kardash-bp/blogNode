const express = require('express')
const bcrypt = require('bcryptjs')

const router = express.Router()
const User = require('../models/userModel')
const { register, login } = require('../controllers/userController')
const {
  userValidationRules,
  loginValidationRules,
  validate,
} = require('../helpers/validator')
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
router.post('/login', loginValidationRules(), validate, login)
router.post('/add', userValidationRules(), validate, register)
module.exports = router
