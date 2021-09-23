const { body, validationResult } = require('express-validator')
const User = require('../models/user')
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
  userValidationRules,
  validate,
}
