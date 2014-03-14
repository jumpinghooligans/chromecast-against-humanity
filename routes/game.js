var mongoose = require('mongoose');

exports.list = function(req, res) {
	var response = {};

	var Game = mongoose.model("Game");

	Game.find({}, function(err, games) {
		if(err) {
			req.flash('error', err);
			res.redirect('/');
		} else {
			complete(games);
		}
	});

	var complete = function(games) {
		response.games = games;
		res.render("game", { response : response });
	}
}

exports.redirect = function(req, res) {
	var gamename = req.params.name;

	//pass the flash message along
	if(res.locals.flasherror.length > 0) {
		req.flash('error', res.locals.flasherror);
	}

	var Game = mongoose.model("Game");
	console.log("redirect to game: " + gamename)
	Game.findOne({ name : gamename }, function(err, game) {
		complete(game);
	});

	var complete = function(game) {
		res.redirect("game/" + game.name + "/" + game.stage);
	}
}

exports.create = function(req, res) {
	var response = {};

	if(req.method == "POST") {
		var data = req.body;
		data.creator = req.session.activeuser.username;
		data.players = [];
		data.players.push({ username : req.session.activeuser.username });

		var Game = mongoose.model("Game");

		var g = new Game(data);
		g.save(function(err, game) {
			if(err) {
				req.flash('error', err.err);
				res.redirect("game/create");
			} else {
				res.redirect("game/" + game.name);
			}
		});
	} else {
		res.render("game/create", { response : response });
	}
}

exports.join = function(req, res) {
	var gamename = req.params.name;

	var new_player = { username : req.session.activeuser.username };

	var Game = mongoose.model("Game");

	Game.findOne({ name : gamename, players : { $elemMatch : { username : new_player.username } } }, function(err, game) {
		if(err) {
			req.flash('error', err.err);
			res.redirect("game/" + gamename);
		}
		if(game) {
			req.flash('error', "You are already a part of this game.");
			res.redirect("game/" + gamename);
		} else {
			Game.update({ name : gamename }, { $push : { players : new_player } }, function (err, game) {
				if(err) {
					req.flash('error', err.err);
					res.redirect("game/" + gamename);
				} else {
					req.flash('message', 'You have successfully joined this game.');
					res.redirect("game/" + gamename + "/ready");
				}
			});
		}
	});
}

exports.ready = function(req, res) {
	var response = {};
	var gamename = req.params.name;

	var Game = mongoose.model("Game");

	response.game = {};
	Game.findOne({ name : gamename }, function(err, game) {
		if(err) {
			req.flash("error", err);
			res.redirect("/game");
		}
		if(game) {
			response.game = game;
			complete();
		} else {
			req.flash("error", "No game with that name found");
			res.redirect("/game");
		}
	});

	var complete = function() {

		for(var i=0; i<response.game.players.length; i++) {
			if(response.game.players[i].username == req.session.activeuser.username) {
				response.readyText = (response.game.players[i].status == "not ready") ? "Ready" : "Not Ready";
				response.readyUrl = (response.game.players[i].status == "not ready") ? "ready" : "notready";
			}
		}

		res.render("game/ready", { response : response });
	}
}

exports.readyToggle = function(req, res) {
	var response = {};
	var gamename = req.params.name;
	var to = req.query.to;

	var Game = mongoose.model("Game");

	Game.findOne({ name : gamename, players : { $elemMatch : { username : req.session.activeuser.username } } },
	function(err, game) {
		var allReady = true;
		for(player in game.players) {
			if(game.players[player].username == req.session.activeuser.username) {
				game.players[player].status = (game.players[player].status == "not ready") ? "ready" : "not ready";
				game.save(function(err, game) {
					res.redirect("/game/" + game.name);
				});
			}

			
		}
	});
}

exports.hand = function(req, res) {
	var response = {};
	var count = 10;

	var Card = mongoose.model("Card");

	//for example combos
	var answers = [];
	var query = Card.find({ cardType : "A" }).limit(count);
	query.exec(function(err, cards) {
		answers = cards;
		complete();
	});

	var complete = function() {
		if(answers.length > 0) {
			console.log(answers);

			response.cards = answers;
		}

		res.render("game/hand", { response : response });
	}
}

exports.tests = function (req, res) {
	var response = {};

	res.render("game/tests", { response : response });
}
