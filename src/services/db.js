/**
  * exposes a function to connect to the db
  * require(mongoose, config)
  * exports { connect() => connection }
  */

const mongoose = require("mongoose")
const config = require("config")

/**
  * create a url from the db config vars
  */
function generateUrl(){
  return "mongodb://" + config.db.username + ":" + config.db.password + "@"
    + config.db.host + ":" + config.db.port + "/" + config.db.dbname
    + "?authSource=admin&authMechanism=SCRAM-SHA-1"
}

/**
  * conect to the database
  */
module.exports.connect = function(){
  mongoose.connect(generateUrl(), {
    useMongoClient: true
  })
}
