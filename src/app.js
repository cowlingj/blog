const config = require("config")

const express = require("express")

const app = express()

const logger = require("morgan")("dev")
app.use(logger)

const routes = require("./routes")
app.use("/", routes)

app.listen(config.port, () => { console.log("listening") })

module.exports = app
