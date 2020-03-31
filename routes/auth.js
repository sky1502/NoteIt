var express = require('express');
var router = express.Router();

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
    router.post('/register', function(req, res) {
        var email = req.body.email;
        con.query("select * from users where email = '" + email + "';", function(err, row) {
            if (row.length == 0) {
                var psw = req.body.psw;
                var cpsw = req.body.cpsw;
                if (!(psw.localeCompare(cpsw))) {
                    var fname = req.body.fname;
                    var lname = req.body.lname;
                    con.query("INSERT INTO users(fname, lname, email, pass) VALUES('" + fname + "', '" + lname + "', '" + email + "', '" + psw + "');", function(err, result) {
                        if (err)
                            throw err;
                        else {
                            res.writeHead(301, { Location: '/login' });
                            console.log("Registered");
                            res.end();
                        }
                    });
                } else {
                    console.log("Passwords Mismatch");
                    res.end();
                }
            } else {
                console.log("Email already exists");
            }
        });

    });
    router.post('/login', passport.authenticate('local', {
        failureRedirect: '/login',
        successRedirect: '/logged/new',
    }), function(req, res) {
        console.log("req");
        res.send("Hey");
    });
    return router;
};