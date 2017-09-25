const routes = require("express").Router()
const config = require("config")

routes.get("/", function(req, res){
  res.status(200).json("{ body: home }")
})

// auth.js
routes.all("/register", require("./auth.js"))
routes.all("/login", require("./auth.js"))
routes.all("/logout", require("./auth.js"))

// write.js
routes.all("/write", require("./write.js"))
routes.all("/edit*", require("./write.js"))

// read.js
routes.all("/read*", require("./read.js"))

// cookie.js
routes.all("/cookie*", require("./cookie"))

// views.js
routes.get("/react", require("./views.js"))
routes.get("/pug", require("./views.js"))
routes.get("/handlebars", require("./views.js"))

// user.js
routes.all("/user*", require("./user.js"))

// 404
routes.get("*", function(req, res, next){
  res.status(404).send("not found")
})

module.exports = routes
