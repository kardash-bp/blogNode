const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Post = require('./postModel')

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, 'is invalid'],
    },
    password: {
      type: String,
      required: [true, 'Password is mandatory'],
      trim: true,
    },
    avatar: {
      type: Buffer,
    },
    role: {
      type: String,
      enum: ['user', 'author', 'admin'],
      default: 'user',
    },
    created: {
      type: Date,
      default: Date.now,
    },
    token: {
      type: String,
    },
    /* For reset password */
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  { timestamps: true }
)
//==== virtual field posts / connection user post
userSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'author',
})
// hide fields
userSchema.methods.toJSON = function () {
  const user = this.toObject()
  delete user.password
  delete user.tokens
  delete user.avatar
  return user
}
userSchema.methods.generateToken = function () {
  return jwt.sign({ user: this }, process.env.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: process.env.JWT_EXPIRE,
  })
}
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8)
  }
  next()
})
module.exports = mongoose.model('User', userSchema)
