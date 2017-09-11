const passport = require("passport")
const LocalStrategy   = require("passport-local").Strategy

// used to serialize the user for the session
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use('register', new LocalStrategy({
  // by default, local strategy uses username and password, we will override with email
  firstName: 'firstName'
  email : 'email',
  password : 'password',
},
function(req, email, password, done) {
  // if email exists
  done(null, false)
  // else insert into db
  done(null, user)
})

passport.use('login', new LocalStrategy({
  // by default, local strategy uses username and password, we will override with email
  email : 'email',
  password : 'password',
},
function(req, email, password, done) {
  // if email doesn't exists
  done(null, false)
  // if password doen't match
  done(null, false)
  // else correct username && password
  done(null, user)
})

passport.use("token", new LocalStrategy({
  accessToken: 'accessToken'
}, function(req, accessToken, done){
  // if token valid
  let user = user.getByToken(accessToken)
  done(null, user)
  //else invalid
  done(null, false)
})
