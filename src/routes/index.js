const routes = require("express").Router()
const config = require("config")

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

// cookie.js
routes.get("/cookie", require("./cookie"))
routes.get("/cookie-parse", require("./cookie"))

// views.js
routes.get("/react", require("./views.js"))
routes.get("/pug", require("./views.js"))
routes.get("/handlebars", require("./views.js"))

// user.js
routes.post("/user/new", require("./user.js"))
routes.get("/user/me", require("./user.js"))
routes.get("/user", require("./user.js"))
routes.get("/user/:id", require("./user.js"))

// 404
routes.get("*", function(req, res, next){
  res.status(404).send("not found")
})

module.exports = routes
