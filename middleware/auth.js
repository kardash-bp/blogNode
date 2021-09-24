const auth = (req, res, next) => {
  if (req.session.user) {
    return next()
  } else {
    req.flash('error', 'Please login!')
    res.redirect('/')
  }
}
module.exports = auth
