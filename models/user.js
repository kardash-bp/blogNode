const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Post = require('./post')

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
      minLength: [3, 'Name is too short!'],
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, 'is invalid'],
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is mandatory'],
      minLength: [3, 'Password is too short!'],
      maxLength: 50,
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
module.exports = mongoose.model('User', userSchema)
