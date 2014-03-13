
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
var flash = require('connect-flash');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('yo this app is secret'));
app.use(express.session());
app.use(flash());
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//user management

app.use(function (req, res, next) {
	res.locals.activeuser = req.session.activeuser;
	res.locals.flasherror = req.flash('error');
	res.locals.flashmsg = req.flash('message');
	next();
});

var auth = function(req, res, next) {
	if(req.session.activeuser) {
		next();
	} else {
		res.redirect('users/login?redirect=' + req.url);
	}
}

app.use(app.router);

app.get('/', routes.index);

app.get('/users', user.list);
app.get('/users/create', user.create);
app.get('/users/login', user.login);
app.get('/users/logout', user.logout);
app.get('/users/:username', user.user);

app.post('/users/create', user.create);
app.post('/users/login', user.login);

app.get('/cards', card.list);
app.get('/cards/import', card.import);

app.post('/cards/import', card.import);

app.get('/game', game.list);
app.get('/game/create', auth, game.create);
app.get('/game/:name', auth, game.redirect);
app.get('/game/:name/join', auth, game.join);
app.get('/game/:name/ready', auth, game.ready);
app.get('/game/:name/readyToggle', auth, game.readyToggle);
app.get('/game/:name/hand', auth, game.hand);
app.get('/game/tests', auth, game.tests);

app.post('/game/create', game.create);

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

		for(chromecast in chromecasts) {
			chromecasts[chromecast].emit("server-message", data);
		}
	});
})
