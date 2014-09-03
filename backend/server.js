var express = require('express');
var app = express();
var passport = require('passport');
var util = require('util');
var TwitterStrategy = require('passport-twitter').Strategy;
var twitter = require('twitter');
var url = require('url');

var TWITTER_CONSUMER_KEY = "jRSMv43lCUYUH0CCBCUDvm72E";  // this is our app key
var TWITTER_CONSUMER_SECRET = "SOo7SwKs9VtXocESi1UKEURI330PDUlFmgUytR7eohnoS5dZ6w"; // this is our app secret

/* Express and passport initializiation */
var session = require('express-session')
app.use(session({ secret: 'new secret' }));
app.use(passport.initialize());
app.use(passport.session());

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
      console.log("Generted token is: ", token);
      console.log("Generated token secret is: ", tokenSecret);
      // To keep the example simple, the user's Twitter profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Twitter account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

// GET /auth/twitter
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Twitter authentication will involve redirecting
//   the user to twitter.com.  After authorization, the Twitter will redirect
//   the user back to this application at /auth/twitter/callback
app.get('/auth/twitter',
  passport.authenticate('twitter'),
  function(req, res){
    // The request will be redirected to Twitter for authentication, so this
    // function will not be called.
  });

// GET /auth/twitter/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
  	console.log("Inside callback token is: ", tempToken);
  	console.log("Inside callback secret is: ", tempSecret);


	var info = {   // Builds out a response for the token and secret for any given user
		token: tempToken,
		s: tempSecret
	}

  res.end(JSON.stringify(info));  // returns the info object containing the user who just logged in token and secret
  });

/* API endpoint for getting user who has logged in's timeline */
app.get('/twit', function(req, res){
	var twit = new twitter({
	    consumer_key: 'jRSMv43lCUYUH0CCBCUDvm72E', // api key (from twitter app)
	    consumer_secret: 'SOo7SwKs9VtXocESi1UKEURI330PDUlFmgUytR7eohnoS5dZ6w',  // api secret (from twitter app)
	    access_token_key: tempToken,  // user key (from oauth response)
	    access_token_secret: tempSecret  // user secret (from oauth response)
	});

	twit.get('/statuses/user_timeline.json', {include_entities:true}, function(data) {
	    res.end(util.inspect(data))
	    // console.log(util.inspect(data));
	});

	/* This can be activated for user streams if we decide to switch back */
	// twit.stream('user', {track:'nodejs'}, function(stream) {
	//     stream.on('data', function(data) {
	//         console.log(util.inspect(data));
	//     });
	//     // Disconnect stream after fifty seconds
	//     // setTimeout(stream.destroy, 50000);
	// });
	// res.end();
})

app.get('/logout', function(req, res){
  req.logout();
  res.end('logged out');
});

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});
