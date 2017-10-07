const routes = require("express").Router()
const Post = require("../models/Post.js")

routes.get("/read", function(req, res){
  res.status(200).send("read")
})
routes.get("/read/:authorId/:postId", function(req, res){
  Post.findOne({ authorId: req.params.authorId, postId: req.params.postId })
    .exec((err, post) => {
      if (err) {
        console.log(err)
        res.sendStatus(500)
      } else {
        if (post) {
          res.status(200).send(post)
        } else {
          res.sendStatus(404)
        }
      }
    })
})

module.exports = routes
