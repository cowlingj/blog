var routes = require("express").Router()

routes.get("/", function(req, res){
  res.status(200).json("{ body: home }")
})

// auth.js
routes.get("/register", require("./auth.js"))
routes.post("/register", require("./auth.js"))
routes.get("/login", require("./auth.js"))
routes.post("/login", require("./auth.js"))
routes.get("/logout", require("./auth.js"))

// write.js
routes.get("/write", require("./write.js"))
routes.get("/edit/:id", require("./write.js"))

// read.js
routes.get("/read", require("./read.js"))
routes.get("/read/:post", require("./read.js"))

// 404
routes.get("*", function(req, res, next){
  res.status(404).send("not found")
})

module.exports = routes
