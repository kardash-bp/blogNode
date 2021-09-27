const express = require('express')
const multer = require('multer')
const router = express.Router()
const Post = require('../models/postModel')
const User = require('../models/userModel')
const Category = require('../models/categoryModel')
const auth = require('../helpers/auth')
const {
  postValidationRules,
  catValidationRules,
  validate,
} = require('../helpers/validator')
const storage = multer.diskStorage({
  destination: './public/uploads',
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
})
const upload = multer({ storage: storage })

router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    const user = await User.findById(post.author)
    res.render('post', { post: post, user: user })
  } catch (err) {
    console.log(err.message)
  }
})

router.get('/dash/add', auth, async (req, res) => {
  try {
    const cat = await Category.find()
    res.render('dashboard', { title: 'Dashboard', cat: cat, msg: {} })
  } catch (err) {
    console.log(err.message)
  }
})
router.get('/cat/:cat', async (req, res) => {
  try {
    const posts = await Post.find({ category: req.params.cat }).sort({
      date: -1,
    })
    posts.forEach((el) => {})
    res.render('index', { posts: posts })
  } catch (err) {
    console.log(err.message)
  }
})
router.post('/cat', auth, catValidationRules(), validate, async (req, res) => {
  console.log(req.body.errors)

  if (req.body?.errors?.length > 0) {
    return res.render('dashboard', {
      title: 'Dashboard',
      errors: req.body.errors,
    })
  }
  try {
    const catAdd = await Category.create(req.body)
    req.flash('success', 'Category added.')

    const cat = await Category.find()
    res.render('dashboard', {
      title: 'Dashboard',
      cat: cat,
      msg: { success: req.flash('success') },
    })
  } catch (err) {
    console.log(err.message)
    req.flash(`error', 'Error: ${err.message}`)
    const cat = await Category.find()
    res.render('dashboard', {
      title: 'Dashboard',
      cat: cat,
      msg: { error: req.flash('error') },
    })
  }
})

router.post(
  '/add',
  auth,
  upload.single('post-img'),

  postValidationRules(),
  validate,

  async (req, res) => {
    if (req.body?.errors?.length > 0) {
      return res.render('dashboard', {
        title: 'Dashboard',
        errors: req.body.errors,
      })
    }
    try {
      const post = req.body
      post.author = req.session?.user._id
      post.imageUrl = req.file?.path.slice(6)
      await Post.create(req.body)
      res.redirect('/')
    } catch (err) {
      console.log(err.message)
    }
  }
)
router.post('/add-comment', async (req, res) => {
  try {
    const { username, postId, comment } = req.body
    const comm = await Post.findOneAndUpdate(
      { _id: postId },
      { $push: { comments: { name: username, body: comment } } },
      { safe: true, upsert: true, new: true }
    )
    console.log('add comm: ', comm)
    res.redirect(`/post/${postId}`)
  } catch (err) {
    console.log(err.message)
  }
})
module.exports = router
