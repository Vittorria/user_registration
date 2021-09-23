// Here we initialize connection to DB
// Load config
console.log("lib/db/conf loaded");
const { Client } = require('pg');

// select typname, oid, typarray from pg_type where typname = 'date' order by oid;
var types = require('pg').types;

var DATE_OID = 1082;

types.setTypeParser(DATE_OID, 'text', (text) => text);

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '123123',
    port: 5432,
});
client.connect();

module.exports = client;
