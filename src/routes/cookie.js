const routes = require("express").Router()
const config = require("config")
const cookieSigner = require("cookie-signature")

// TODO (DONE:) get cookies to work
// TODO (DONE): cookie vs jwt, ===
// TODO (DONE): create db
routes.get("/cookie", function(req, res){
  // cookie lasts 1 min
  res.cookie("cookieName", cookieSigner.sign("test2 value", config.cookieSignature), { signed: true, maxAge: 60 * 1000 })
    .status(200)
    .send()
})

routes.get("/cookie-parse", function(req, res){
  console.log(req.cookies)
  console.log(req.signedCookies)
  res.sendStatus(200)
})

module.exports = routes
