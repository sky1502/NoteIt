var express = require('express');
var router = express.Router();
var jsdom = require('jsdom');
const { JSDOM } = jsdom;

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

var loggedin = function(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
}
router.get('/', function(req, res, next) {
    res.render('login');
});

router.get('/login', function(req, res, next) {
    res.render('login');
});

router.get('/forgotpass', function(req, res, next) {
    res.render('forgotpass');
});

router.get('/register', function(req, res, next) {
    res.render('register');
});

router.get('/logged/:title', loggedin, function(req, res, next) {
    var uid = req.user.uid;
    var title = req.params.title;
    con.query("select * from notes where uid = " + uid + "", function(err, rows) {
        var notes = rows;
        var note = "";
        for (var i = 0; i < notes.length; i++) {
            if (!(notes[i].title.localeCompare(title))) {
                note = notes[i].note;
                break;
            }
        }
        console.log(note);
        res.render('logged', {
            notes: notes,
            title: title,
            note: note,
        });
    });
});

router.get('/profile', loggedin, function(req, res, next) {
    var uid = req.user.uid;
    con.query("select * from users, notes where users.uid = " + uid + "", function(err, rows) {
        var notes = rows;
        res.render('profile', {
            notes: notes,
            fname: rows[0].fname,
            lname: rows[0].lname,
            email: rows[0].email
        })
    });
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});


router.post('/nnote', loggedin, function(req, res, next) {
    var title = req.body.ntitle;
    var uid = req.user.uid;
    con.query("select * from notes where title = '" + title + "' AND uid = " + uid + ";", function(err, row) {
        if (row.length == 0) {
            fname = req.user.fname;
            note = req.body.nnote;
            con.query("INSERT INTO notes(uid, fname, title, note) VALUES(" + uid + ", '" + fname + "', '" + title + "', '" + note + "');", function(err, result) {
                if (err)
                    throw err;
                else {
                    console.log("Noted");
                    res.writeHead(301, { Location: '/logged/new' });
                    res.end();
                }
            });
        } else {
            console.log("Note Title Exists");
        }
    });
});



module.exports = router;