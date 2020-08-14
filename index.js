const bodyParser = require('body-parser');
const { Client } = require('pg');
const express = require('express');
const app = express();

// create application/json parser
const jsonParser = bodyParser.json()

const hostname = '127.0.0.1';
const port = 3000;

const dbSchema = 'public';

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '123123',
    port: 5432,
});

client.connect();

/* =========== Some Initialize stuff =============== */

app.use(bodyParser.json());

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

/* =========== FROM HERE =============== */

/** =========== POST /register - registers a new user ===========*/

app.post('/register', function (req, res) {
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
            res.send(val.rows);
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
            res.send(val.rows);
        }).catch((err) => {
            res.status(500).end("Error: " + err);
        });
    } else {
        res.status(400).end({message: 'userID not set!'});
    }
});
