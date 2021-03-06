const sslRedirect = require('heroku-ssl-redirect');
const express = require('express');
const session = require('express-session');

const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('connect-flash');

const app = express();
const port = process.env.PORT || 7900;

const rateLimit = require("express-rate-limit");

// setup MongoDB Atlas
require('./models/db.js');

// passport config
require('./config/passport.js')(passport);

// routes setup
var backendRoutes = require('./routes/backend-routes.js');
var frontendRoutes = require('./routes/frontend-routes.js');

// limit request rate to protect against naive ddos attacks
app.enable("trust proxy");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000
});

// get user's permission to use their location
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

// use json
app.use(express.json())

// enable ssl redirect
app.use(sslRedirect());

// set the view engine
app.set('view engine', 'pug');

// test express where the static files are kept
app.use(express.static(__dirname + '/public'));

// allow an incoming api request's body to be parsed
app.use(bodyParser.json());
// allow a HTML form's POST request's body to be parsed
app.use(express.urlencoded({ extended: true }));

// initialize express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// initialize passport middleware
app.use(passport.initialize());
app.use(passport.session());

// initialize connect flash
app.use(flash());

// flash the messages, if there's any, in the next response
// Note: for more info on res.locals, read up: https://expressjs.com/en/api.html
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// define local variables for logged in users
app.use((req, res, next) => {
  res.locals.loggedIn = req.isAuthenticated();
  if (req.isAuthenticated()){
    res.locals.loginId = req.user._id;
    res.locals.loginName = req.user.name;
    res.locals.loginPic = req.user.profilePicURL;
    // res.locals.loginRating = req.user.starRatingAvg;
    // res.locals.loginJoined = req.user.dateJoined;
  }
  next();
});

// assign routes
app.use('/',backendRoutes);
app.use('/',frontendRoutes);

// use rate limiter
app.use(limiter);

app.use(function(req, res, next){
  res.status(404);
  res.render('404');
  return;
});

app.listen(port, function(){
  console.log("Listening on port " + port);
});
