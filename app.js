
/**
 * Module dependencies.
 */

var express = require('express');

global.dbURL = process.env.MONGOHQ_URL || "mongodb://localhost/cards-against";
var db = require('./db');

var routes = require('./routes');
var user = require('./routes/user');
var card = require('./routes/card');
var game = require('./routes/game');

var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

app.get('/users', user.list);

app.get('/cards', card.list);
app.get('/cards/import', card.import);
app.post('/cards/import', card.import);

app.get('/game', game.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
