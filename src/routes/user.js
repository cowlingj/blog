/**
  * routes for user related requests
  */

const routes = require("express").Router()
const forceSSL = require("express-force-ssl")
const User = require("../models/User.js")
const digest = require("../services/encryption.js").digest

// TODO Protect with auth (only i should be able to call users, authed can call user/:id)

/**
  * create a new user
  * req.body { firstName, lastName, email, password }
  */
// TODO respond with accessToken if 200
routes.post("/user/new", forceSSL, function(req, res){
  // get the next userId
  User.nextCount(function(err, count) {
    // handle errors
    if (err || typeof count !== "number") {
      console.log("Error with nextCount:\n" + err)
      res.status(500).send()
    } else { // save our new user with incremented count
      // handle errors
      if (!req.body.password) {
        res.status(400).send("password required")
      } else { // create User
        let newUser = new User({id: count, firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email, hashedPassword: digest(req.body.password)})
        // validate user
        newUser.validate((err)=>{
          if(err) {
            // email in use
            if (err.errors.email.kind === "unique") {
              console.warn("email " + err.errors.email.value + " in use")
              res.status(400).send("email " + err.errors.email.value + " in use")
            } else { // other validation error
              console.error(err)
              res.status(400).send("The credentials were invalid")
            }
          } else { // valid user
            newUser.save(function(err){
              if(err) { // check for errors
                console.error("saving error:/n" + err)
                res.status(500).send()
              } else { // everything is okay
                res.status(200).send()
              }
            }) // save
          } // else (save is successful)
        }) // validate
      } // else (there is a password)
    } // else (nextCount is okay)
  }) // nextCount
}) // post

/**
  * get all users
  */
// TODO: pagination
routes.get("/user", forceSSL, function(req, res){
  let query = User.find({}).select("firstName lastName -_id")
  query.exec(function(err, match){
    if (err) {
      console.log(err)
      res.status(500).send()
    } else {
      console.log(match)
      res.status(200).send(match)
    }
  })
})

/**
  * get a specific user
  */
routes.get("/user/:id", forceSSL, function(req, res){
  let query = User.find({ id: req.params.id}).select("firstName lastName -_id")
  query.exec(function(err, match){
    if (err) {
      console.log(err)
      res.status(500).send()
    } else {
      console.log(match)
      res.status(200).send(match)
    }
  })
})

module.exports = routes
