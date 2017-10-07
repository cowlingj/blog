const routes = require("express").Router()

routes.get("/react", function(req, res){
  res.render("react.jsx", {text: "welcome to react"}) // TODO: why jsx and not js
})

routes.get("/pug", function(req, res){
  res.render("pug.pug", {text: "welcome to pug"})
})

routes.get("/handlebars", function(req, res){
  res.render("handlebars.hbs", {text: "welcome to handlebars"})
})

module.exports = routes
