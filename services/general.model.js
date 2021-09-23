const express = require('express'); 
const router = express.Router();
const db = require(".//db.js");
const http = require("http");
const dbSchema = 'public2';
let self = {};

self.getTable = function (req, res) {
    console.log('-----SELECT*FROM public.all_users -----');
    db.query(`SELECT*FROM ${dbSchema}.all_users ORDER BY userid`).then((val) => {
        console.log('Result: ', val.rows.length);
        res.send(val.rows);
    }).catch((err) => {
        res.status(500).end("Error: " + err);
    });
};

self.registerNewUser = function (req, res) { 
    console.log('-----SELECT * FROM public2.f_add_new_user -----');
    let params = [
        req.params.username,
        req.params.fullname,
        req.params.email,
        req.params.psw,
        +req.params.inviterId,
    ];
    db.query(`SELECT*FROM ${dbSchema}.f_add_new_user(${params.map((el, i) => '$' + ++i).join(',')});`, params).then((val) => {
        if (val.rows.lenght) {
            res.send(val.rows[0]);
        }
    }).catch((err) => {
        res.status(500).end("Error: " + err);
    });
};

self.syncronizeAdd = function (req, res) {
    console.log('-----syncronizeSndBackend() -----');
    const options = {
        hostname: '127.0.0.1',
        port: 3333,
        path: `/register/sync/${req.params.username}/${req.params.fullname}/${req.params.email}/${req.params.psw}/${req.params.inviterId}`,
        method: 'GET'
    }
    var request = http.get(options, function (resp) {
        console.log("request resp.headers:", resp.headers);
        //resp.pipe(res);
    });
    // Handle errors
    request.on('error', function (err) {
        console.log("++++++++++++sendReq Handle errors:", err);
        // res.status(500).end("Error:" + err);
    });
    // req.end()
};



self.deleteRecord = function (req, res) {
    console.log('-----DELETE *FROM public.all_users -----');
    if (req.params.username) {
        db.query(`DELETE FROM ${dbSchema}.all_users WHERE "username" = '${req.params.username}'`).then((val) => {
            res.send(val.rows);
        }).catch((err) => {
            res.status(500).end("Error: " + err);
        });
    } else {
        res.status(400).end({message: 'userID not set!'});
    }
};

self.syncronizeDelete = function (req, res) {
    console.log('-----syncronizeDelete() -----');
    const options = {
        hostname: '127.0.0.1',
        port: 3333,
        path: `/delete/sync/${req.params.username}`,
        method: 'GET'
    }
    var request = http.get(options, function (resp) {
        console.log("request resp.headers:", resp.headers);
        //resp.pipe(res);
    });
    // Handle errors
    request.on('error', function (err) {
        console.log("++++++++++++sendReq Handle errors:", err);
        // res.status(500).end("Error:" + err);
    });
    // req.end()
};

/** =========== POST /register - registers a new user ===========*/

app.post('/registerX', function (req, res) {
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

app.get('/user/:userId(\\d+)', function (req, res) {
    if (!!+req.params.userId) {
        client.query(`SELECT*FROM ${dbSchema}.all_users WHERE userid = ${+req.params.userId}`).then((val) => {
            res.send(val.rows[0]);
        }).catch((err) => {
            res.status(500).end("Error: " + err);
        });
    } else {
        res.status(400).end({message: 'userId not set!'});
    }
});


/** =========== GET /history/:userId - returns the balance history of a given user ===========*/

app.get('/history/:userId(\\d+)', function (req, res) {
    if (!!+req.params.userId) {
        client.query(`SELECT*FROM ${dbSchema}.history_users WHERE userid = ${+req.params.userId}`).then((val) => {
            res.send(val.rows[0]);
        }).catch((err) => {
            res.status(500).end("Error: " + err);
        });
    } else {
        res.status(400).end({message: 'userID not set!'});
    }
});

module.exports = self;

