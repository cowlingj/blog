/**
  * routes for user related requests
  */

const routes = require("express").Router()
const forceSSL = require("express-force-ssl")
const User = require("../models/User.js")
const digest = require("../services/encryption.js").digest
const config = require("config")
const cookieSigner = require("cookie-signature")
const auth = require("../services/auth.js")

// TODO (DONE): Protect with auth (only i should be able to call users, authed can call user/:id


routes.get("/user/me", forceSSL, auth.token, function(req, res){
  if (res.locals.auth.isAuthenticated) {
    console.log(res.locals.user)
    res.status(200).send(res.locals.user)
  } else {
    res.sendStatus(401)
  }

})

/**
  * get all users
  */
// TODO: pagination
routes.get("/user", forceSSL, auth.superuser, function(req, res){
  if (!res.locals.auth.isAuthenticated) {
    res.sendStatus(401)
  } else {
    let query = User.find({}).select("firstName lastName -_id")
    query.exec(function(err, match){
      if (err) {
        console.log(err)
        res.status(500).send()
      } else {
        console.log(match)
        res.status(200).send(match)
      }
    })
  }
})

/**
  * get a specific user
  */
routes.get("/user/:id", forceSSL, function(req, res){
  let query = User.find({ id: req.params.id}).select("firstName lastName -_id")
  query.exec(function(err, match){
    if (err) {
      console.log(err)
      res.status(500).send()
    } else {
      console.log(match)
      res.status(200).send(match)
    }
  })
})

module.exports = routes
