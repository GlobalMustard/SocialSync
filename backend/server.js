var express = require('express');
var app = express();
var passport = require('passport');
var util = require('util');
var TwitterStrategy = require('passport-twitter').Strategy;
var twitter = require('twitter');
var url = require('url');
var cors = require('cors');
var bodyParser = require('body-parser');

var TWITTER_CONSUMER_KEY = "jRSMv43lCUYUH0CCBCUDvm72E";  // this is our app key
var TWITTER_CONSUMER_SECRET = "SOo7SwKs9VtXocESi1UKEURI330PDUlFmgUytR7eohnoS5dZ6w"; // this is our app secret

/* Express and passport initializiation */
var session = require('express-session');
app.use(session({ secret: 'new secret' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(bodyParser.json());   
app.use(bodyParser.urlencoded());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

/* Temporary holder for authorized token and secret *** THIS NEEDS TO BE FIXED */
var tempToken = "";
var tempSecret = "";

/* Builds out new passport strategy for twitter */
passport.use(new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    process.nextTick(function () {
      tempToken = token;
      tempSecret = tokenSecret;
      console.log(done);
      console.log("Generated token is: ", token);
      console.log("Generated token secret is: ", tokenSecret);
      return done(null, profile);
    });
  }
));

//This allows clients to access the server and make requests.
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  next();
});

/*  
GET /auth/twitter 
  The first step in Twitter authentication will involve redirecting
  the user to twitter.com.  After authorization, the Twitter will redirect
  the user back to this application at /auth/twitter/callback
*/
app.get('/auth/twitter',
  passport.authenticate('twitter'),
  function(req, res){
    // The request will be redirected to Twitter for authentication, so this
    // function will not be called.
  });

/*  
GET /auth/twitter/callback
  Once user is authenticated at twitter, they will be redirected to this endpoint where we can return then
  user's token and secret to then be stored in localstorage
*/
app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    // console.log(res);
    // console.log(req);
    // console.log("Inside callback token is: ", tempToken);
    // console.log("Inside callback secret is: ", tempSecret);

  var info = {   // Builds out a response for the token and secret for any given user
    token: tempToken,
    secret: tempSecret
  }

  res.end(JSON.stringify(info));  // returns the info object containing the user who just logged in token and secret
});

/* API endpoint for accessing user's timeline */
app.post('/twitter', function(req, res){
  console.log('twit has been accessed');
  console.log(req.body.token);
  var twit = new twitter({
      consumer_key: TWITTER_CONSUMER_KEY, // api key (from twitter app)
      consumer_secret: TWITTER_CONSUMER_SECRET,  // api secret (from twitter app)
      access_token_key: req.body.token,  // user key (from oauth response)
      access_token_secret: req.body.secret  // user secret (from oauth response)
  });

  twit.get('/statuses/home_timeline.json', {include_entities:true}, function(data) {
    var arr = [];
    for(var i = 0; i < data.length; i++){
      var obj = {};
      obj.image = data[i].user.profile_image_url;
      obj.user = data[i].user.screen_name;
      obj.message = data[i].text;
      obj.createdAt = data[i].created_at;
      arr.push(obj);
    }
    res.end(JSON.stringify(arr));
  });
})


app.get('/logout', function(req, res){
  req.logout();
  res.end('logged out');
});

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});
