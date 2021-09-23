var express = require('express');
var router = express.Router();
var model = require("../services/general.model");

// Task No. 1
// p.s controllers and business logic - awfully wrong thing to do, please don't repeat this ever

/** =========== POST /register - registers a new user ===========*/

router.post('/register', function (req, res) {
    let params = [
        req.body.username,
        req.body.fullname,
        req.body.email,
        req.body.psw,
        req.body.inviterId,
    ];
    client.query(`SELECT*FROM ${dbSchema}.f_add_new_user(${params.map((el, i) => '$' + ++i).join(',')});`, params).then((val) => {
        res.send(val.rows[0]);
    }).catch((err) => {
        res.status(500).end("Error: " + err);
    });
}).use(bodyParser.json());


/** =========== GET /user/:userId - returns details about user ===========*/

router.get('/user/:userId(\\d+)', function (req, res) {
    if (!!+req.params.userId) {
        client.query(`SELECT*FROM ${dbSchema}.all_users WHERE userid = ${+req.params.userId}`).then((val) => {
            res.send(val.rows);
        }).catch((err) => {
            res.status(500).end("Error: " + err);
        });
    } else {
        res.status(400).end({message: 'userId not set!'});
    }
});


/** =========== GET /history/:userId - returns the balance history of a given user ===========*/

router.get('/history/:userId(\\d+)', function (req, res) {
    if (!!+req.params.userId) {
        client.query(`SELECT*FROM ${dbSchema}.history_users WHERE userid = ${+req.params.userId}`).then((val) => {
            res.send(val.rows);
        }).catch((err) => {
            res.status(500).end("Error: " + err);
        });
    } else {
        res.status(400).end({message: 'userID not set!'});
    }
});

// Task No. 2
// p.s using GET instead of POST - also don't do this ever


/** =========== GET /register - registers a new user ===========*/

router.get('/table', function (req, res, next) {
    model.getTable(req, res);
});


/** =========== POST /table - information about all the users ===========*/

router.post('/add-user', function (req, res) {
    model.registerNewUser(req, res);
    model.syncronizeAdd(req, res);
 });
router.get('/add-user/sync', function (req, res) {
    model.registerNewUser(req, res);
});

/** =========== DELETE /delete-user/:userId - returns the balance history of a given user ===========*/
router.get('/delete/:username', function (req, res) {
    model.deleteRecord(req, res);
    model.syncronizeDelete(req, res);
});

router.get('/delete/sync/:username', function (req, res) {
    model.deleteRecord(req, res);
});

module.exports = router;

