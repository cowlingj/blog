const mongoose = require("mongoose")
const Schema = mongoose.Schema
const autoIncrement = require("mongoose-auto-increment")
const uniqueValidator = require("mongoose-unique-validator")

// ~64 kb max post size
const TITLE_MAX_LENGTH = 128
const BODY_MAX_LENGTH = 8192

const postSchema = new Schema({
  postId: {
    type: Number,
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  authorId: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true,
    validate: {
      validator: function() {
        return this.title.length <= TITLE_MAX_LENGTH
      }
    }
  },
  body: {
    type: String,
    required: true,
    validate: {
      validator: function() {
        return this.body.length <= BODY_MAX_LENGTH
      }
    }
  },
  created: {
    type: Date,
    required: true
  },
  updated: {
    type: Date,
    required: true
  }
})

postSchema.index({ postId: 1, authorId: 1 }, { unique: true })

postSchema.plugin(uniqueValidator)
postSchema.plugin(autoIncrement.plugin, { model: "Post", field: "postId" })

const Post = mongoose.model("Post", postSchema)

Post.on("index", function (err) {
  if (err) console.error(err)
})

module.exports = Post
