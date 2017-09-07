// our configuration
const config = require("config")

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

// listen
app.listen(config.port, () => { console.log("listening") })

module.exports = app
