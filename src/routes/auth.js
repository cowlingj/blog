const routes = require("express").Router()
const forceSSL = require("express-force-ssl")
const config = require("config")

routes.get("/register", forceSSL, function(req, res){
  res.status(200).json("{ body: register }")
})

routes.post("/register", forceSSL, function(req, res){
  res.status(200).json("{ body: login }")
})

routes.get("/login", forceSSL, function(req, res){
  res.status(200).json("{ body: login }")
})

routes.post("/login", forceSSL, function(req, res){
  res.status(200).json("{ body: login }")
})

routes.get("/logout", forceSSL, function(req, res){
  res.status(200).json("{ body: logout }")
})

module.exports = routes
