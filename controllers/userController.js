const User = require('../models/userModel')
const bcrypt = require('bcryptjs')

const register = async (req, res) => {
  // express validator errors in req.body
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
}

const login = async (req, res, next) => {
  if (req.body?.errors?.length > 0) {
    // express validator errors

    return res.render('login', { errors: req.body.errors })
  }
  try {
    const user = await User.findOne({ username: req.body.username })
    if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
      return res.render('login', { err: 'Unable to login!' })
    } else {
      const token = user.generateToken()
      res.cookie('jwt', token, {
        maxAge: 24 * 60 * 60,
        // You can't access these tokens in the client's javascript
        httpOnly: true,
        // Forces to use https in production
        secure: process.env.NODE_ENV === 'production' ? true : false,
      })

      req.session.user = user
      res.redirect('/')
    }
  } catch (err) {
    console.log(err.message)
    next(err)
  }
}
module.exports = { register, login }
