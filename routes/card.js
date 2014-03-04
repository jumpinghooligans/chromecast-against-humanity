var mongoose = require('mongoose');

exports.list = function(req, res) {
	var response = {};

	var Card = mongoose.model("Card");

	Card.find({ cardType : "A" }, function(err, cards) {
		response.answers = cards;
		complete();
	});
	Card.find({ cardType : "Q" }, function(err, cards) {
		response.questions = cards;
		complete();
	});

	var complete = function() {
		if(response.questions && response.answers) {

			// response.example = response.questions[0];
			// response.example.text = response.example.text.replace("_" , response.answers[0].text);

			res.render("cards", { response : response });
		}
	}
}

exports.import = function (req, res) {
	var cardSource = require('../card_list')
	var response = {};

	response.cards = cardSource.cardList;
	response.post = (req.method == "POST");

	if(response.post) {
		var Card = mongoose.model("Card");

		var errors = [];
		for(var i=0; i<response.cards.length; i++) {
			(function (i) {
				var c = new Card(response.cards[i]);
				c.save(function(err) {
					errors.push(err);
					complete(i);
				});
			})(i);
		}
	} else {
		res.render("cards/import", { response : response });
	}

	var complete = function(i) {
		console.log('complete ' + i + ' vs ' + response.cards.length);
		if(i==response.cards.length-1) {
			response.message = errors.join("<br />");
			res.render("cards/import", { response : response });
		}
	}
}