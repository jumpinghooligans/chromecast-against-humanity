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

	//for example combos
	var examples = [];
	response.examples = [];
	Card.find({ cardType : "Q", numAnswers : 1 }, function(err, cards) {
		examples = cards;
		complete();
	});

	var complete = function() {
		if(response.questions && response.answers && examples.length>0) {

			for(var i=0; i<5; i++) {
				var example_question = JSON.parse(JSON.stringify(examples[Math.floor(Math.random()*examples.length)]));
				var example_answer = JSON.parse(JSON.stringify(response.answers[Math.floor(Math.random()*response.answers.length)]));

				console.log("Merging: Q[" + example_question.text + "] with A[" + example_answer.text + "]")

				if(example_question.text.indexOf("_") == -1) {
					example_question.text += '<br /><br /><span>' + example_answer.text + "</span>";
				} else {
					example_question.text = example_question.text.replace("_", "<span>" + example_answer.text.replace(/[!.?]/, "") + "</span>");
				}

				response.examples.push(example_question);
			}

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