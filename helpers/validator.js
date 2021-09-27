const { body, validationResult } = require('express-validator')
const User = require('../models/userModel')
const Post = require('../models/postModel')

const postValidationRules = () => {
  return [
    body('title').not().isEmpty().withMessage('Must have title'),
    body('subtitle').not().isEmpty().withMessage('Must have subtitle'),
    body('text').trim().isLength({ min: 5 }).withMessage('Must have some text'),
  ]
}
const loginValidationRules = () => {
  return [
    body('username').not().isEmpty().withMessage('Must have a unique username'),
    body('password').not().isEmpty().withMessage('Must have a good password'),
  ]
}
const catValidationRules = () => {
  return [body('name').not().isEmpty().withMessage('Category must have a name')]
}
const userValidationRules = () => {
  return [
    body('username')
      .isLength({ min: 3 })
      .trim()
      .escape()
      .withMessage('Username must have more than 3 characters'),

    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Not a valid email')
      .bail()
      .custom(async (email, { req }) => {
        try {
          const user = await User.findOne({ email: email }).exec()
          if (user) {
            req.body.errors = 'Email already exists.'
            return false
          } else {
            return true
          }
        } catch (err) {
          console.log(err.message)
          return false
        }
      })
      .withMessage('Email already taken'),
    body('password')
      .isLength({ min: 5 })
      .withMessage('Password must be at least 5 chars long')
      .matches(/\d/)
      .withMessage('Password must contain a number'),
  ]
}
const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const errorsArray = []
  errors.array().map((err) => errorsArray.push(err.msg))
  req.body.errors =
    req.body?.errors?.length > 0
      ? [...errorsArray, req.body.errors]
      : [...errorsArray]
  next()
}
module.exports = {
  loginValidationRules,
  catValidationRules,
  postValidationRules,
  userValidationRules,
  validate,
}
