const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
  const token = req.cookies.jwt
  try {
    jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch (err) {
    console.log(err.message)
    req.flash('error', 'Please login!')
    res.redirect('/user/login')
  }
}
module.exports = auth
