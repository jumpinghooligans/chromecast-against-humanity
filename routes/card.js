var mongoose = require('mongoose');

exports.list = function(req, res) {
	var response = {};

	var Card = mongoose.model("Card");

	Card.find({ cardType : "A" }, function(err, cards) {
		response.answers = cards;
		render();
	});
	Card.find({ cardType : "Q" }, function(err, cards) {
		response.questions = cards;
		render();
	});

	var render = function() {
		if(response.questions && response.answers)
			res.render("cards", { response : response });
	}
}

exports.import = function (req, res) {
	var cardSource = require('../card_list')
	var response = {};

	response.cards = cardSource.cardList;
	response.post = (req.method == "POST");

	if(response.post) {
		var Card = mongoose.model("Card");

		for(var i=0; i<response.cards.length; i++) {
			var c = new Card(response.cards[i]);
			c.save(function(err) {
				response.message += err + "<br />";

				if(i == response.cards.length){
					res.render("cards/import", { response : response });
				}
			});
		}
	} else {
		res.render("cards/import", { response : response });
	}

}