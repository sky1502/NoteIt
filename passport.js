var localStrategy = require('passport-local').Strategy;

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

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    passport.use('local', new localStrategy({
        usernameField: 'email',
        passwordField: 'psw',
        passReqToCallback: true //passback entire req to call back
    }, function(req, email, psw, done) {
        con.query("select * from users where email = '" + email + "'", function(err, rows) {
            if (err)
                return done(err);
            else if (rows.length == 0) {
                return done(null, false);
            } else {
                var dbPassword = rows[0].pass;
                if (!(dbPassword == req.body.psw)) {
                    return done(null, false);
                } else {
                    return done(null, rows[0])
                }
            }
        });
    }));
}