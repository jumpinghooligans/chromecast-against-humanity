
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
var receiver = require('./routes/receiver');

var http = require('http');
var path = require('path');
var io = require('socket.io');
var util = require('util');

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

app.get('/receiver', receiver.title);
app.get('/receiver/examples', receiver.examples);
app.get('/receiver/examples/:count', receiver.examples);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var games = {};

io.listen(server).on("connection", function (socket) {
	//console.log("got a connection from " + util.inspect(socket));
	socket.on('register', function(data) {
		console.log("register: " + JSON.stringify(data));

		if(games[data.game] == undefined) {
			games[data.game] = {};

			games[data.game].players = {};
			games[data.game].chromecasts = {};
		}
		if(data.role == "player") {
			games[data.game].players[data.id] = socket;
		} else {
			games[data.game].chromecasts[data.id] = socket;
		}
	});

	socket.on('receiver-message', function(data) {
		console.log("Received recever message: " + JSON.stringify(data));
	});

	socket.on('sender-message', function(data) {
		console.log("Received sender message: " + JSON.stringify(data));

		//from sender to receiver
		console.log(games);

		var chromecasts = games[data.player_info.game].chromecasts;

		for(var i=0; i<chromecasts.length; i++) {
			console.log(chromecasts[i]);
		}
	});
})
