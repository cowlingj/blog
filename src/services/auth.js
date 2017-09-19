/**
  * authentication middleware
  * require(config, jsonwebtoken, /models/User.js, /services/encryption.js)
  */
const path = require("path")
const config = require("config")
const jwt = require("jsonwebtoken")
const User = require(path.join(__dirname, "..", "models", "User.js"))
const digest = require(path.join(__dirname, "encryption.js")).digest
const cookieSigner = require("cookie-signature")




module.exports.register = (req, res, next) => {

  res.locals.auth = {}

  // must check for password first so i can hash it
  if (!req.body.password) { // no password - pass errors along
    res.locals.auth.isAuthenticated = false
    res.locals.auth.error = { message: "no password"}
    next()
  } else { // create User

    let newUser = new User({firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email, hashedPassword: digest(req.body.password)})
    // validate user
    newUser.validate((err)=>{
      if(err) {
        // email in use
        if (err.errors.email.kind === "unique") {
          res.locals.auth.isAuthenticated = false
          res.locals.auth.error = { message: "email " + err.errors.email.value + " exists"}
          next()
        } else { // other validation error
          res.locals.auth.isAuthenticated = false
          res.locals.auth.error = { message: "invalid credentials", error: err}
          next()
        }
      } else { // valid user
        newUser.save(function(err){
          if(err) { // check for errors
            res.locals.auth.isAuthenticated = false
            res.locals.auth.error = { message: "db error", error: err}
            next()
          } else { // everything is okay

            // sign the token
            const token = jwt.sign({
              id: newUser.id,
              firstName: newUser.firstName,
              lastName: newUser.lastName,
              email: newUser.email
            }, config.secret, {
              expiresIn: "1d" // expires in 24 hours
            })

            // set the token as a cookie
            res.cookie("accessToken",
              cookieSigner.sign(token, config.cookieSignature),
              { signed: true, maxAge: 24 * 60 * 60 * 1000 }
            )

            // set the user and auth object
            res.locals.auth.isAuthenticated = true
            res.locals.user = {
              id: newUser.id,
              firstName: newUser.firstName,
              lastName: newUser.lastName,
              email: newUser.email
            }
            next()
          }
        }) // save
      } // else (save is successful)
    }) // validate
  } // else (there is a password)
}

module.exports.token = (req, res, next) => {
  // check header or url parameters or post parameters for token

  res.locals.auth = {}

  const signedToken = req.signedCookies.accessToken

  const encryptedToken = signedToken ? cookieSigner.unsign(signedToken, config.cookieSignature) : null

  // decode token
  if (!encryptedToken) {
    // if there is no token
    // return an error
    res.locals.auth.isAuthenticated = false
    res.locals.auth.error = { message: "no token" }
    next()
  } else {
    // verifies secret and checks exp
    jwt.verify(encryptedToken, config.secret, function(err, userToken) {
      if (err) {
        // if a token is out of date clear it and redirect to login
        if (err.name === "TokenExpiredError") {
          console.log("token out of date")
          res.clearCookie("accessToken").redirect("/login")
        } else {
          // pass other errors along
          res.locals.auth.isAuthenticated = false
          res.locals.auth.error = { message: "token colud not be verified", error: err }
          next()
        }
      } else { // we have a valid token

        // search for the user we had in the token
        let userQuery = {
          id: userToken.id,
          firstName: userToken.firstName,
          lastName: userToken.lastName,
          email: userToken.email
        }

        User.findOne(userQuery)
          .select("firstName lastName id email isSuperuser -_id")
          .exec((err, user) => {
            if (err) { // search error - pass along
              console.log("error " + err)
              res.locals.auth.isAuthenticated = false
              res.locals.auth.error = { message: "findOne failed", error: err }
              next()
            } else if (!user) { // no user - invalid token

              console.warn(JSON.stringify(userQuery,null, 2) + "has a token but is not in the database")

              res.locals.auth.isAuthenticated = false
              res.locals.auth.error = { message: "no matching user" }
              next()
            } else { // everything is okay

              res.locals.auth.isAuthenticated = true
              res.locals.user = user
              next()
            }
          })


      }
    })
  }
}

module.exports.login = (req, res, next) => {
  res.locals.auth = {}

  if (!req.body.email || !req.body.password) { // no email or password - pass on error

    res.locals.auth.isAuthenticated = false
    res.locals.auth.error = { message: "email or password incorrect" }
    next()

  } else {

    // find user from email, password combination
    User.findOne({
      email: req.body.email,
      hashedPassword: digest(req.body.password)
    })
      .select("id firstName lastName email -_id")
      .exec((err, user) => {
        if (err) { // database error - pass it on

          res.locals.auth.isAuthenticated = false
          res.locals.auth.error = { message: "findOne failed", error: err }
          next()
        } else if (!user) { // invalid email password combination - pass error along

          res.locals.auth.isAuthenticated = false
          res.locals.auth.error = { message: "email or password incorrect" }
          next()
        } else {

          // sign the token
          const token = jwt.sign({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
          }, config.secret, {
            expiresIn: "1d" // expires in 24 hours
          })

          // set the token as a cookie
          res.cookie("accessToken",
            cookieSigner.sign(token, config.cookieSignature),
            { signed: true, maxAge: 60 * 60 * 1000 }
          )

          res.locals.auth.isAuthenticated = true
          res.locals.user = user
          next()
        }
      })

  }
}

module.exports.superuser = (req, res, next) => {
  // check header or url parameters or post parameters for token

  res.locals.auth = {}

  const signedToken = req.signedCookies.accessToken

  const token = signedToken ? cookieSigner.unsign(signedToken, config.cookieSignature) : null

  // decode token
  if (!token) {

    // if there is no token
    // return an error
    res.locals.auth.isAuthenticated = false
    res.locals.auth.error = { message: "no token" }
    next()
  } else {
    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, userToken) {
      if (err) {
        res.locals.auth.isAuthenticated = false
        res.locals.auth.error = { message: "token colud not be verified", error: err }
        next()
      } else {
        let userQuery = {
          id: userToken.id,
          firstName: userToken.firstName,
          lastName: userToken.lastName,
          email: userToken.email
        }
        User.findOne(userQuery)
          .select("firstName lastName id email isSuperuser -_id")
          .exec((err, user) => {
            if (err) {
              res.locals.auth.isAuthenticated = false
              res.locals.auth.error = { message: "findOne failed", error: err }
              next()
            } else if (!user || !user.isSuperuser) {
              console.log("blocked access to a protected route from " + user)
              res.locals.auth.isAuthenticated = false
              res.locals.auth.error = { message: "access denied" }
              next()
            } else {
              res.locals.auth.isAuthenticated = true
              res.locals.user = user
              next()
            }
          })
      }
    })
  }
}
