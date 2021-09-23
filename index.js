const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const jsonParser = bodyParser.json()

const hostname = '127.0.0.1';
const port = 3334;

var mainRouter = require('./routes/general.router');

/* =========== Some Initialize stuff =============== */

app.use(bodyParser.json());
app.use(express.json());
app.use(  '/', mainRouter);

/* =========== FROM HERE =============== */

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
