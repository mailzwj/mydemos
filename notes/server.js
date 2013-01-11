/**
 * Module dependencies.
 */
var express = require('express'),
  routes = require('./routes'),
  detail = require('./routes/detail'),
  http = require('http'),
  path = require('path');
var app = express();
app.configure(function() {
  app.set('port', process.env.PORT || 80);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({
    secret: "keyboard cat",
    maxAge: 1200000
  }));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});
app.configure('development', function() {
  app.use(express.errorHandler());
});
app.get('/', routes.index);
app.get('/reg', detail.reg);
app.post('/reg', detail.reg);
app.get('/main', detail.main);
app.get('/detail/:id', detail.show);
app.get('/add', detail.add);
app.get('/edit/:id', detail.edit);
app.get('/del/:id', detail.del);
app.get('/quit', function(req, res) {
  req.session.username = null;
  res.redirect("/");
});
http.createServer(app).listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});