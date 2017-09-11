// our configuration
const config = require("config")
var fs = require("fs")
const certificate = fs.readFileSync("https/server.crt")
const key = fs.readFileSync("https/server.key")
const https = require("https")
const http = require("http")

// express app
const express = require("express")
const app = express()

// TODO: view engines

const bodyParser= require("body-parser")
// parse application/x-www-form-urlencoded
const urlencodedParser = bodyParser.urlencoded({ extended: false })
// parse application/json
const jsonParser = bodyParser.json()
// parse other bodies
const rawParser = bodyParser.raw()
const textParser = bodyParser.text()

// parse cookies and signed cookies
const cookieParser = require("cookie-parser")
app.use(cookieParser(config.cookieSignature))

// log requests
const logger = require("morgan")("dev")
app.use(logger)

// anything in assets should be served directly (NOT TESTED)
express.static("/assets")

// leave everything to the router
const routes = require("./routes")
app.use("/", routes)

// ssl and servers (http, https)
const forceSSL = require("express-force-ssl")
app.set("forceSSLOptions", {
  enable301Redirects: true,
  httpsPort: config.httpsPort
})

const httpServer = http.createServer(app)
const httpsServer = https.createServer({
  cert: certificate,
  key: key
}, app)

// listen
httpServer.listen(config.httpPort, () => { console.log("http listening [" + config.httpPort + "]") })
// if trying to ping server below, we need to use https
// a simple thing but easy to forget
httpsServer.listen(config.httpsPort, () => { console.log("https listening [" + config.httpsPort + "]") })

module.exports = app
