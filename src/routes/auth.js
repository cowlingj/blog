var routes = require("express").Router()

routes.get("/register", function(req, res){
  res.status(200).json("{ body: register }")
})

routes.post("/register", function(req, res){
  res.status(200).json("{ body: login }")
})

routes.get("/login", function(req, res){
  res.status(200).json("{ body: login }")
})

routes.post("/login", function(req, res){
  res.status(200).json("{ body: login }")
})

routes.get("/logout", function(req, res){
  res.status(200).json("{ body: logout }")
})

module.exports = routes
