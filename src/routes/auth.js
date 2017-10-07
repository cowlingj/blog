const routes = require("express").Router()
const forceSSL = require("express-force-ssl")
const config = require("config")
const auth = require("../services/auth.js")

// TODO (DONE): auth

routes.get("/register", forceSSL, function(req, res){
  res.sendStatus(204)
})

/**
  * create a new user
  * req.body { firstName, lastName, email, password }
  */
routes.post("/register", forceSSL, auth.register, function(req, res){
  if (res.locals.auth.isAuthenticated) {
    res.sendStatus(200)
  } else {
    res.status(401)
      .send(res.locals.auth)
  }
})

routes.get("/login", forceSSL, function(req, res){
  res.status(200).render("login.pug")
})

routes.post("/login", forceSSL, auth.login, function(req, res){
  if (res.locals.auth.isAuthenticated) {
    res.sendStatus(200)
  } else {
    res.status(401)
      .send(res.locals.auth)
  }
})

routes.get("/logout", forceSSL, function(req, res){
  res.clearCookie("accessToken").sendStatus(200)
})

module.exports = routes
