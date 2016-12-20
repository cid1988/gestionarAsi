var express = require('express');
var app = express();
var nconf = require('./loadConfig')();
var MongoStore = require('connect-mongo')(express);

var store = new MongoStore({
    db: nconf.get('mongo:database'),
    host: nconf.get('mongo:hostname'),
    port: nconf.get('mongo:port'),
    username: nconf.get('mongo:username'),
    password: nconf.get('mongo:password'),
    auto_reconnect: nconf.get('mongo:autoreconnect')
});

app.use(require('compression')());
app.use(function (req, res, next) {
  res.set('X-Frame-Options', 'DENY');
  next();
});
app.use(express.bodyParser({
    keepExtensions: true,
    uploadDir: __dirname + "/uploads"
}));
app.use(express.methodOverride());
app.use(express.cookieParser(nconf.get('cookies:secret')));
app.use(express.session({
    store: store,
    secret: nconf.get('session:secret'),
    key: nconf.get('session:key')
}));
app.use(express.errorHandler());
app.use(app.router);

require('./glue/configure')(app, nconf.get(), function () {
  require('http')
  .createServer(app)
  .listen(nconf.get('http:port') || process.env.PORT || 8080, process.env.IP, function () {
      console.log("Listening");
  });
});
