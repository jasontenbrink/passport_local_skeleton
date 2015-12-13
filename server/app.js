var express = require("express");
var app = express();
var bodyParser = require('body-parser');

var pg = require('pg');
var passport = require('./strategies/user');
var session = require('express-session');

var register = require('./routes/register');
var user = require('./routes/user');
var index = require('./routes/index');
var path = require('path');
var logout = require('./routes/logout.js');
var authenticate = require('./routes/authenticate.js');
var login = require('./routes/login.js');

// App Set //
app.set("port", (process.env.PORT || 5000));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Passport Session Configuration //
app.use(session({
   secret: 'secret',
   key: 'user', //req.session
   resave: 'true',
   saveUninitialized: false,
   cookie: {maxage: 600000, secure: false}
}));

//this has to go before the passport session gets initialized, otherwise
//static files will disappear once a session ends (breaks on login > logout > login)
app.use(express.static (path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());



// Routes

app.use('/register', register);
app.use('/login', login);

//authentication firewall
app.use('/*', authenticate);
//routes that require authentication
app.use('/logout', logout);
app.use('/user', user);
app.use('/', index);



// Mongo Connection //
//var mongoURI = "mongodb://localhost:27017/user_passport_session";

var connectionString = process.env.DATABASE_URL   || 'postgres://localhost:5432/church';

// Listen //
app.listen(app.get("port"), function(){
   console.log("Listening on port: " + app.get("port"));
});

module.export = app;
