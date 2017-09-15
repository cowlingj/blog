const mongoose = require("mongoose")
const Schema = mongoose.Schema
const autoIncrement = require("mongoose-auto-increment")
const uniqueValidator = require("mongoose-unique-validator")

const userSchema = new Schema({
  // type, required, unique
  userId: {
    type: Number
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function() {
        // letter, { letter, dot, or dash }*, @, { lowercase }+,{lowercase}2 or 3
        // john.smith@example.com
        return /\w[\w\.-]*@[a-z]+\.[a-z]{2,3}/.test(this.email) // eslint-disable-line no-useless-escape
      },
      message: "not a valid email"
    }
  },
  hashedPassword: String
})

userSchema.plugin(uniqueValidator)
userSchema.plugin(autoIncrement.plugin, { model: "User", field: "userId" })

const User = mongoose.model("User", userSchema)

User.on("index", function (err) {
  if (err) console.error(err)
})

module.exports = User
