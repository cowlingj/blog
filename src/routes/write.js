const routes = require("express").Router()
const forceSSL = require("express-force-ssl")
const tokenAuth = require("../services/auth.js").token
const Post = require("../models/Post.js")

routes.get("/write", forceSSL, tokenAuth, function(req, res){
  if (res.locals.auth.isAuthenticated) {
    res.status(200).render("write.pug")
  } else {
    res.sendStatus(401)
  }
})

// TODO (DONE): save post object in database
routes.post("/write", forceSSL, tokenAuth, function(req, res){
  if (res.locals.auth.isAuthenticated) {
    console.log(JSON.stringify(req.body, null, 2))
    let post = new Post({
      // postId: auto
      authorName: res.locals.user.firstName + " " + res.locals.user.lastName,
      authorId: res.locals.user.id,
      title: req.body.postTitle,
      body: req.body.postBody,
      created: new Date(),
      updated: new Date()
    })
    post.validate((err) => {
      if (err) {
        console.log(err)
        res.sendStatus(500)
      } else {
        post.save((err) => {
          if (err) {
            console.log(err)
            res.sendStatus(500)
          } else {
            res.render("post.pug", { post: post }) // TODO (DONE): write post.pug, and be more specific with object
          }
        })
      }
    })
  } else {
    res.sendStatus(401)
  }
})

routes.get("/edit/:id", function(req, res){
  res.status(200).send("edit " + req.params.id)
})

module.exports = routes
