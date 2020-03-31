var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var passport = require('passport');
var jsdom = require('jsdom');

require('./passport')(passport)
var auth = require('./routes/auth')(passport);
var index = require('./routes/index');
var users = require('./routes/users');

var mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Gagan@1234"
});
con.connect(function(err) {
    if (err)
        throw err;
});
con.query("use noteit", function(err, result) {});


var app = express();
app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    name: 'JSESSION',
    secret: 'MYSECRETISVERYSECRET',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use('/', index);
app.use('/users', users);
app.use('/auth', auth);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
app.listen(8080);
module.exports = app;