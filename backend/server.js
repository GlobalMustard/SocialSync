var express = require('express');
var app = express();
var passport = require('passport');
var util = require('util');
var TwitterStrategy = require('passport-twitter').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var twitter = require('twitter');
var url = require('url');
var cors = require('cors');
var bodyParser = require('body-parser');
var fbapi = require('facebook-api');
var https = require('https');
 
var TWITTER_CONSUMER_KEY = "jRSMv43lCUYUH0CCBCUDvm72E";  // this is our twitter app key
var TWITTER_CONSUMER_SECRET = "SOo7SwKs9VtXocESi1UKEURI330PDUlFmgUytR7eohnoS5dZ6w"; // this is our twitter app secret
var FACEBOOK_APP_ID = "608079415979002"; // this is our facebook app id
var FACEBOOK_APP_SECRET = "21afcf213f5ab04aba850de11966dc4e"; // this is our facebook app secret
 
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
var tempFacebookAccessKey = "";
 
/* Builds out new passport strategy for twitter */
passport.use(new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: "http://localhost:3000/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    process.nextTick(function () {
      tempToken = token; 
      tempSecret = tokenSecret;
      console.log("Generated token is: ", token);
      console.log("Generated token secret is: ", tokenSecret);
      return done(null, profile);
    });
  }
));
 
/* Builds out new passport strategy for facebook */
passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    tempFacebookAccessKey = accessToken;
    return done(null, profile);
  }
));
 
/* GET /auth/facebook 
  The first step in Facebook authentication will involve redirecting
  the user to facebook.com.  After the user logs in, Facebook will redirect
  the user back to this server at /auth/facebook/callback */
app.get('/auth/facebook',
  passport.authenticate('facebook'));
 
/* GET /auth/facebook/callback
  Once user is authenticated at facebook, they will be redirected to this endpoint where we can 
  then use the acquired access token to make API calls */
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    /* This is how our facebook graph api request will be viewed */
    function viewback(err, data) { 
        if(err) { 
          res.end("Error: " + JSON.stringify(err));
        } else {
          res.end("Data: " + JSON.stringify(data))
        }
    }
 
    https.get("https://graph.facebook.com/cocacola/feed?access_token=CAAIpC4WVqZCoBAPHYCIaqy8DEKsdjrh436EDpiffFQ0HM3t6sR3gpi5iTZB4XCSwnADDmIi5wdzBACJ74jhknGNTTzfxmDDJKejqPKYXhCH1yyZBjEYYK1NgtqtNrCaZBgiqDoQxe2mdE1ZAlokr0Yt3ZB7XCZCT7EmTQcTmm3A84Ip1CctG6piLNXvVEEedRuFOUG13laZAZBh0GYZAssJ4fu8wnjvogi6Q8ZD", function(res) {
      console.log("Got response: " + res.statusCode);
      console.log(res);
    }).on('error', function(e) {
      console.log("Got error: " + e.message);
    });
    res.end("Testing");
    // Build out new facebook graph request with newly acquired access key for given user
    // var client = fbapi.user(tempFacebookAccessKey);
    // // client.me.info(viewback);
    // client.get('cocacola').info(viewback);
  });
 
//This allows clients to access the server and make requests.
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  next();
});
 
/* GET /auth/twitter 
  The first step in Twitter authentication will involve redirecting
  the user to twitter.com.  After the user logs in, Twitter will redirect
  the user back to this server at /auth/twitter/callback */
app.get('/auth/twitter',
  passport.authenticate('twitter'),
  function(req, res){
    // The request will be redirected to Twitter for authentication, so this
    // function will not be called.
  });
 
/* GET /auth/twitter/callback
  Once user is authenticated at Twitter, they will be redirected to this endpoint where we can 
  then use return the acquired token and secret to be stored in local storage*/
app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
 
  var info = {   // Builds out a response for the token and secret for any given user
    token: tempToken,
    secret: tempSecret
  }
 
  res.end(JSON.stringify(info));  // returns the info object containing the user who just logged in's token and secret
});
 
/* API endpoint for accessing user's timeline
  This endpoint expects a query parameter which will have the user's token and secret that will be inserted into
  the twitter API request */
app.post('/twitter', function(req, res){
  var twit = new twitter({
      consumer_key: TWITTER_CONSUMER_KEY, // api key (from twitter app)
      consumer_secret: TWITTER_CONSUMER_SECRET,  // api secret (from twitter app)
      access_token_key: req.body.token,  // user key (from oauth response)
      access_token_secret: req.body.secret  // user secret (from oauth response)
  });
 
  /* This is the actual twitter get request for the user's timeline */
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
 
    res.end(JSON.stringify(arr)); // This will display all the tweets obtained from the twitter api request
  });
})
 
var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});
