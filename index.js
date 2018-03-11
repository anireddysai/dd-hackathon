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
const max_limit = 100;
const cors = require('koa-cors');

// Initialize configuration variables
nconf
    .argv({ parseValues: true })
    .env({ parseValues: true, lowerCase: true })
    .defaults({
        rethink_database: 'hackathon',
        rethink_port: 28015,
        crate_port: 4200,
        app_port: 8080
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
    ssl: { rejectUnauthorized: false }
});

crate.connect(nconf.get('crate_host'), nconf.get('crate_port'));

// Start web server using Koa
const app = new Koa();
const server = require('http').Server(app.callback());
const io = require('socket.io')(server,{path:'/socket.io'});

const router = new Router();

app.use(logger());

// HTTP GET /logs/rethinkdb?min=etc&max=etc to get logs between dates
router.get('/logs/rethinkdb', async ctx => {
    const { min, max } = ctx.query;
    if (!min || !max)
        ctx.throw(400, 'Must specify min and max in query string.');

    const minDate = moment.utc(min, moment.ISO_8601);
    const maxDate = moment.utc(max, moment.ISO_8601);
    if (!minDate.isValid() || !maxDate.isValid())
        ctx.throw(400, 'Min and max must be ISO 8601 date strings');

    let {limit,skip} = ctx.query;
    const entries = await r
        .table('logs')
        .between(minDate.toDate(), maxDate.toDate(), { index: 'time' })
        .slice(parseInt(skip), parseInt(limit))
        .run();

    ctx.status = 200;
    ctx.body = entries;
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

    let {limit,skip} = ctx.query;

    const entries = await crate.execute(
        'SELECT * FROM logs WHERE time BETWEEN ? AND ? LIMIT ? OFFSET ?',
        [minDate.toDate(), maxDate.toDate(), parseInt(limit), parseInt(skip)]
    );

    ctx.status = 200;
    ctx.body = entries.json;
});

router.get('/logs/rethinkdb/pipe',async ctx => {
    const { min, max,limit } = ctx.query;
    ctx.req.pipe(r.table('logs').toStream()
  .on('error', console.log)
  .pipe(ctx.body)
  .on('error', console.log)
  .on('end', function() {
    r.getPool().drain();
  })
);

   // ctx.status = 200;
   // ctx.body = entries;

})

// Use router middleware
app.use(router.routes());
app.use(router.allowedMethods());

app.use(cors({origin:"*"}));

// Start server on app port.
const port = nconf.get('app_port');
server.listen(port, () => {
    console.log(`Server started on port ${port}.`);
});
//io.set('origins', 'http://localhost:4200');
io.set('transports',['websocket', 'xhr-polling']);

io
.on('connection', function(socket) {
    console.log('new connection');

//   const { min, max,limit } = ctx.query;
//    const entries =  r
//    .table('logs')
//    .changes()
//    .run();

//    console.log(entries);
//    entries.each(logs=> {
//        socket.emit('log',logs);	
//    })

var log = {
    "architecture":"x86_64",
    "availabilityZone":"us-west-2a",
    "contentLength":"3994",
    "hostname":"ip-172-31-25-71","id":
    "9f1fc56c-6b1b-424e-a482-9428c2d321e7",
    "imageId":"ami-b730b0cf",
    "instanceId":"i-08c32e4129c3d12dd",
    "level":30,
    "ms":"0.454",
    "msg":"GET /application/2f97b9ca-6b3b-4520-8577-ebceedda13ad 200 0.454 ms - 3994","name":"Venom","pid":2820,"privateIp":"172.31.25.71",
    "publicHostname":"ec2-34-215-73-47.us-west-2.compute.amazonaws.com",
    "publicIpv4":"34.215.73.47",
    "region":"us-west-2",
    "remoteAddress":"75.171.179.111",
    "req":{
      "headers":{
        "accept-encoding":"gzip",
        "access-control-allow-headers":"Content-Type, Origin",
        "access-control-allow-methods":"GET, OPTIONS",
        "access-control-allow-origin":"*",
        "connection":"upgrade",
        "content-type":"application/json",
        "host":"api.im360.com",
        "if-modified-since":"Fri, 09 Mar 2018 23:59:57 GMT+00:00",
        "if-none-match":"W/\"f9a-9efG3AGY+0GO6NviqczZt9+51Ww\"",
        "key":"61d74a94-b52d-4aa7-ab09-25531ed9638a",
        "protocol-version":"1.1",
        "signature":"",
        "user-agent":"Dalvik/2.1.0 (Linux; U; Android 7.0; SM-G930V Build/NRD90M)",
        "x-forwarded-for":"75.171.179.111, 172.31.35.234",
        "x-forwarded-port":"443",
        "x-forwarded-proto":"http",
        "x-nginx-proxy":"true",
        "x-real-ip":"172.31.35.234"
      },
      "method":"GET",
      "remoteAddress":"127.0.0.1",
      "remotePort":33146,
      "url":"/api/v1.1/application/2f97b9ca-6b3b-4520-8577-ebceedda13ad"
    },
    "reqStart":"2018-03-10T00:00:00.752Z",
    "res":{
      "header":"HTTP/1.1 200 OK\r\nX-DNS-Prefetch-Control: off\r\nStrict-Transport-Security: max-age=15552000; includeSubDomains\r\nX-Download-Options: noopen\r\nX-Content-Type-Options: nosniff\r\nX-XSS-Protection: 1; mode=block\r\nServer-Version: v1.8.6-2-g3dac0d9\r\nContent-Type: application/json; charset=utf-8\r\nContent-Length: 3994\r\nETag: W/\"f9a-9efG3AGY+0GO6NviqczZt9+51Ww\"\r\nDate: Sat, 10 Mar 2018 00:00:00 GMT\r\nConnection: keep-alive\r\n\r\n","statusCode":200
    },
    "resStart":"2018-03-10T00:00:00.752Z",
    "time":"2018-03-10T00:00:00.752Z",
    "type":"access",
    "v":0,
    "venom_version":"v1.8.6-2-g3dac0d9",
    "version":"v1.8.6-2-g3dac0d9"
  }
    setInterval(() =>{
        socket.emit("log",{'log':log,db:"rethinkdb"});
    },2000)

 });

