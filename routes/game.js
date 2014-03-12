var mongoose = require('mongoose');

exports.list = function(req, res) {
	var response = {};

	res.render("game", { response : response });
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