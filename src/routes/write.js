var routes = require("express").Router()

routes.get("/write", function(req, res){
  res.status(200).send("write")
})

routes.get("/edit/:id", function(req, res){
  res.status(200).send("edit " + req.params.id)
})

module.exports = routes
