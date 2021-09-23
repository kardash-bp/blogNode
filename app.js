const express = require('express')
const helmet = require('helmet')
const path = require('path')
const morgan = require('morgan')
require('./Database')
const xss = require('xss-clean')
const flash = require('connect-flash')
const expressValidator = require('express-validator')
const { nanoid } = require('nanoid')
const blogRouter = require('./routers/blogRouter')
const postRouter = require('./routers/postRouter')
const userRouter = require('./routers/userRouter')
const multer = require('multer')
const upload = multer({ dest: './public/uploads/' })
const app = express()
app.use(helmet())
app.use(morgan('short'))
app.use(xss())
// ===== session setup =============
const session = require('express-session')
const sess = {
  secret: 'kardas',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 3600000 },
}
if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}
app.use(session(sess))
// ==================================
app.use(flash())
app.use((req, res, next) => {
  res.locals.msg = req.flash()
  next()
})
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
//====
app.locals.moment = require('moment')
app.locals.truncate = (str, max, suffix) =>
  str.length < max
    ? str
    : `${str.substr(
        0,
        str.substr(0, max - suffix.length).lastIndexOf(' ')
      )}${suffix}`
// use for field validation and customizing the messages
// app.use(
//   expressValidator({
//     errorFormatter: function (param, msg, value) {
//       return {
//         message: msg,
//       }
//     },
//   })
// )
app.use('/user', userRouter)
app.use('/post', postRouter)
app.use('/', blogRouter)
//* catch 404 and forward to error handler
app.use(function (req, res, next) {
  //  tried to open an URL
  const err = new Error(`Tried to reach ${req.originalUrl}`)
  err.status = 404
  // New property on err so that our middleware will redirect
  err.shouldRedirect = true
  next(err)
})

// define error-handling middleware last, after other app.use() and routes calls
app.use(function (err, req, res, next) {
  // console.error(err.message)
  if (!err.status) err.status = 500 // Sets a generic server error status code if none is part of the err

  if (err.shouldRedirect) {
    res.render('errorPage', { error: err }) // Renders a errorPage for the user
  } else {
    res.status(err.status).send(err.message) // If shouldRedirect is not defined in our error, sends our original err data
  }
})
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`App listening on ${port}`))
