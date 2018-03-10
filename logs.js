/**
 * Hackathon example server
 * Allows getting logs from CrateDB or RethinkDB using:
 * HTTP GET /logs/cratedb?min=etc&max=etc
 * or HTTP GET /logs/rethinkdb?min=etc&max=etc
 *
 * Feel free to modify this code however you want, or delete
 * it and start over from scratch.
 */

require('dotenv').config();
// const nconf = require('nconf');
// const rethinkdbdash = require('rethinkdbdash');

// nconf
//     .argv({ parseValues: true })
//     .env({ parseValues: true, lowerCase: true })
//     .defaults({
//         rethink_database: 'hackathon',
//         rethink_port: 28015,
//         crate_port: 4200,
//         app_port: 8081
//     });

//     // function execute() {

//     // }

//     const r = rethinkdbdash({
//         db: nconf.get('rethink_database'),
//         host: nconf.get('rethink_host'), 
//         port: nconf.get('rethink_port'),
//         pool: false,
//         ssl: { rejectUnauthorized: false }
//     });

//     function insert(table,value) {
//         r.table(table).insert(value).run(conn, callback)
//     }

//     function fetch(table) {
//         console.log(r);
//         //const entries = r.table(table).run();

//         //console.log(entries);
//     }

//     const entries = r.table('logs').run();

//     console.log(entries);

// //    fetch('logs');


var express = require('express');
var session = require('express-session');
var RDBStore = require('express-session-rethinkdb')(session);
var server = require('http').Server(app.callback());
var io = require('socket.io')(server);

var rDBStore = new RDBStore({
  connectOptions: {
    servers: [
      { host: '127.0.0.1', port: 28015 }
    ],
    db: 'logs',
    discovery: false,
    pool: false,
    buffer: 50,
    max: 1000,
    timeout: 20,
    timeoutError: 1000
  },
  table: 'logs',
  sessionTimeout: 1296000000,
  flushInterval: 3600000
});

var app = express();
//app.use( require('cookie-parser')() );
app.use( session({
    key: "sid",
    secret: "xxxxxxxxxxxxxxxxx",
    cookie: { maxAge: 860000 },
    store: rDBStore,
    resave: false,
    saveUninitialized: true
  })
);

console.log(rDBStore);

//rDBStore.connect();
const entries = rDBStore.run();

