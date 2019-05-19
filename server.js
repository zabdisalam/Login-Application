const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const exphbs = require('express-handlebars');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongo = require('mongodb');


const app = express();
app.use('/static', express.static('public'));

//mongoose connection
mongoose.connect('mongodb://localhost/APIA', {
    useNewUrlParser: true,
    useCreateIndex: true
});

//db routes
var routes = require('./routes/index');
var user= require('./routes/user');

//View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');

//BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

//Passport Init
app.use(passport.initialize());
app.use(passport.session());

//Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
         root    = namespace.shift(),
         formParam = root;

    while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
    }
    return {
        param : formParam,
        msg : msg,
        value : value
    };
  }
}));

//Connect Flash
app.use(flash());

//Global Vars
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next()
});


app.use('/', routes);
app.use('/user', user);

//Set Port
app.set('port', (process.env.PORT || 3624));

app.listen(app.get('port'), function(){
    console.log('Server is running on port '+app.get('port'));
})