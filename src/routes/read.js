var routes = require("express").Router()

routes.get("/read", function(req, res){
  res.status(200).send("read")
})
routes.get("/read/:post", function(req, res){
  res.status(200).send("read " + req.params.post)
})

module.exports = routes
