// TODO: get a logger for my use (winston?)

/******************************************************************************
 * FILE HANDLING                                                              *
 ******************************************************************************/

const fs = require("fs")

/******************************************************************************/

/******************************************************************************
 * CONFIGURATION                                                              *
 ******************************************************************************/

const config = require("config")

/******************************************************************************/
/******************************************************************************
 * APPLICATION                                                                *
 ******************************************************************************/

const express = require("express")
const app = express()

/******************************************************************************/

/******************************************************************************
 * LOGGING                                                                    *
 ******************************************************************************/

// log requests
const logger = require("morgan")("dev")
app.use(logger)

/******************************************************************************/

/******************************************************************************
 * PARSING                                                                    *
 ******************************************************************************/
// parse many types of body
const bodyParser = require("body-parser")
// parse application/x-www-form-urlencoded
const urlencodedParser = bodyParser.urlencoded({ extended: true })
app.use(urlencodedParser)
// parse application/json
const jsonParser = bodyParser.json()
app.use(jsonParser)
// parse other bodies
const rawParser = bodyParser.raw()
app.use(rawParser)
const textParser = bodyParser.text()
app.use(textParser)
// parse cookies and signed cookies
const cookieParser = require("cookie-parser")
app.use(cookieParser(config.cookieSignature))
// protect against xxs
// TODO: do I need this?
const validator = require("express-validator")
app.use(validator())

/******************************************************************************/

/******************************************************************************
 * VIEWS                                                                      *
 ******************************************************************************/

// TODO (DONE): view engines

app.set("views", __dirname + "/views")

// for a single view engine
// app.set("view engine", "ext")

// since we're using many
const consolidate = require("consolidate")
app.engine("pug", consolidate.pug)
app.engine("jsx", consolidate.react)
app.engine("hbs", consolidate.handlebars)

/******************************************************************************/

/******************************************************************************
 * DATABASE                                                                   *
 ******************************************************************************/


const db = require("./services/db.js")
db.connect()

const mongoose = require("mongoose")
const conn = mongoose.connection
conn.on("error", console.error.bind(console, "connection error:"))
conn.once("open", function() {

  // initialize plugins for mongoose
  const autoIncrement = require("mongoose-auto-increment")
  autoIncrement.initialize(conn)
  console.log("db listening [" + config.db.host + ":" + config.db.port + "]")

  /****************************************************************************
   * ROUTING                                                                  *
   ****************************************************************************/

  // anything in public should be served directly
  app.use(express.static(__dirname + "/public"))

  // leave everything else to the router
  const routes = require("./routes")
  app.use("/", routes)

  /****************************************************************************/

  /****************************************************************************
   * SERVERS                                                                  *
   ****************************************************************************/

  const certificate = fs.readFileSync("https/server.crt")
  const key = fs.readFileSync("https/server.key")
  const https = require("https")
  const http = require("http")

  // ssl redirecting
  const forceSSL = require("express-force-ssl")
  app.set("forceSSLOptions", {
    enable301Redirects: true,
    httpsPort: config.httpsPort
  })

  // initialize servers
  const httpServer = http.createServer(app)
  const httpsServer = https.createServer({
    cert: certificate,
    key: key
  }, app)

  // listen
  httpServer.listen(config.httpPort, () => {
    console.log("http listening [" + config.httpPort + "]")
  })
  // if trying to ping server below, we need to use https
  // a simple thing but easy to forget
  httpsServer.listen(config.httpsPort, () => {
    console.log("https listening [" + config.httpsPort + "]")
  })

  /****************************************************************************/

})

/******************************************************************************/

module.exports = app
