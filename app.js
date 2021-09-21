const express = require('express')
const helmet = require('helmet')
const path = require('path')
const morgan = require('morgan')
const xss = require('xss-clean')
const { nanoid } = require('nanoid')
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

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))

app.get('/test', (req, res) => {
  console.log(req.sessionID)
  res.send('test')
})
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`App listening on ${port}`))
