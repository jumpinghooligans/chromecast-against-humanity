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

		var Game = mongoose.model("Game");

		var g = new Game(data);
		g.save(function(err, game) {
			if(err) {
				req.flash('error', err);
				res.render("game/create", { response : response });
			} else {
				res.redirect("game/" + game.name);
			}
		});
	} else {
		res.render("game/create", { response : response });
	}
}

exports.ready = function (req, res) {
	var response = {};

	res.render("game/ready", { response : response });
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
