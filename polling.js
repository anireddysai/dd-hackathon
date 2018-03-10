/**
 * Hackathon example server
 * Allows getting logs from CrateDB or RethinkDB using:
 * HTTP GET /logs/cratedb?min=etc&max=etc
 * or HTTP GET /logs/rethinkdb?min=etc&max=etc
 *
 * Feel free to modify this code however you want, or delete
 * it and start over from scratch.
 */

require('dotenv/config');
const nconf = require('nconf');
const Koa = require('koa');
const Router = require('koa-router');
const crate = require('node-crate');
const logger = require('koa-logger');
const rethinkdbdash = require('rethinkdbdash');
const moment = require('moment');
var cors = require('koa-cors');
const rethinkdb = require('rethinkdb');
const serve = require('koa-static');
const max_limit = 50000;
const rethinkdb = require('rethinkdb');

// Initialize configuration variables
nconf
    .argv({ parseValues: true })
    .env({ parseValues: true, lowerCase: true })
    .defaults({
        rethink_database: 'logs',
        rethink_port: 28015,
        crate_port: 4200,
        app_port: 8081
    })
    .required([
        'rethink_database',
        'rethink_host',
        'rethink_port',
        'crate_host',
        'crate_port',
        'app_port'
    ]);

// Connect to databases
const r = rethinkdbdash({
    db: nconf.get('rethink_database'),
    servers: [
        { host: nconf.get('rethink_host'), port: nconf.get('rethink_port') }
    ],
    pool: false,
    ssl: { rejectUnauthorized: false }
});

crate.connect(nconf.get('crate_host'), nconf.get('crate_port'));

// Start web server using Koa
//const app = new Koa();
const app = new Koa();
var server = require('http').Server(app.callback());
var io = require('socket.io')(server);

const WebSocket = require('ws');
const router = new Router();

app.use(logger());
app.use(cors({origin:'*'}));
// HTTP GET /logs/rethinkdb?min=etc&max=etc to get logs between dates

router.get('/logs/rethinkdb', async ctx => {
    const { min, max,limit } = ctx.query;
    if (!min || !max)
        ctx.throw(400, 'Must specify min and max in query string.');

    const minDate = moment.utc(min, moment.ISO_8601);
    const maxDate = moment.utc(max, moment.ISO_8601);

    if (!minDate.isValid() || !maxDate.isValid())
        ctx.throw(400, 'Min and max must be ISO 8601 date strings');

    const entries = await r
        .table('logs')
        .between(minDate.toDate(), maxDate.toDate(), { index: 'time' })
        .limit(limit)
        .run();

    ctx.status = 200;
    ctx.body = [{test:"test"}];
});

// HTTP GET /logs/cratedb?min=etc&max=etc to get logs between dates
router.get('/logs/cratedb', async ctx => {
    const { min, max } = ctx.query;
    if (!min || !max)
        ctx.throw(400, 'Must specify min and max in query string.');

    const minDate = moment.utc(min, moment.ISO_8601);
    const maxDate = moment.utc(max, moment.ISO_8601);

    if (!minDate.isValid() || !maxDate.isValid())
        ctx.throw(400, 'Min and max must be ISO 8601 date strings');

    const entries = await crate.execute(
        'SELECT * FROM logs WHERE time BETWEEN ? AND ? LIMIT ?',
        [minDate.toDate(), maxDate.toDate(), max_limit]
    );

    ctx.status = 200;
    ctx.body = entries.json;
});

router.get('/logs/rethinkdb/pipe',async ctx => {
    // const { min, max,limit } = ctx.query;
    // const entries = await r
    //     .table('logs')
    //     .limit(1)
    //     .run();

   // entries.each((err,data)=>{
   //     console.log(err,data);
   // });

    ctx.status = 200;
    ctx.body = entries;

})

var connection = null;

// Use router middleware
app.use(router.routes());
app.use(router.allowedMethods());

// Start server on app port.
const port = nconf.get('app_port');
server.listen(port, () => {
    console.log(`Server started on port ${port}.`);
});

io.set('transports', [ 'websocket','xhr-polling']);
io.on('connection', function(socket) {
    console.log('new connection');


    r.table('games').changes().run(conn, function(err, cursor) {
        cursor.each(console.log);
      });
      setInterval(function() {
          console.log("sending data");
        socket.emit('log', {
            msg: 'Server to client, do you read me? Over.'
          });
    
      },1000);
});
