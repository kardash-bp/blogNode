const express = require('express')
const multer = require('multer')
const router = express.Router()
const Post = require('../models/post')
const User = require('../models/user')
const Category = require('../models/category')
const auth = require('../middleware/auth')
const { postValidationRules, validate } = require('../middleware/validator')
const storage = multer.diskStorage({
  destination: './public/uploads',
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
})
const upload = multer({ storage: storage })

router.get('/add', auth, async (req, res) => {
  try {
    const cat = await Category.find()
    res.render('addPost', { title: 'Add Post', cat: cat })
  } catch (err) {
    console.log(err.message)
  }
})
router.post(
  '/add',
  auth,
  upload.single('post-img'),

  postValidationRules(),
  validate,

  async (req, res) => {
    console.log(req.body.errors)

    if (req.body?.errors?.length > 0) {
      return res.render('addPost', {
        title: 'Add Post',
        errors: req.body.errors,
      })
    }
    try {
      const post = req.body
      post.author = req.session?.user._id
      post.imageUrl = req.file?.path.slice(6)
      console.log(req.file, post)
      await Post.create(req.body)
      res.redirect('/')
    } catch (err) {
      console.log(err.message)
    }
  }
)

router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    const user = await User.findById(post.author)
    res.render('post', { post: post, user: user })
  } catch (err) {
    console.log(err.message)
  }
})
module.exports = router
