var mongoose = require("mongoose");

exports.title = function(req, res){
	res.render("receiver", { title : "Receiver" });
};

exports.examples = function (req, res) {
	var count = (req.params.count) ? req.params.count : 5;

	var Card = mongoose.model("Card");

	//for example combos
	var questions = [];
	Card.find({ cardType : "Q", numAnswers : 1 }, function(err, cards) {
		questions = cards;
		complete();
	});

	var answers = [];
	Card.find({ cardType : "A" }, function(err, cards) {
		answers = cards;
		complete();
	});

	var complete = function() {
		if((questions.length > 0) && (answers.length > 0)) {
			console.log(answers);
			var examples = [];

			var example_question_base = questions[Math.floor(Math.random()*questions.length)];
			for(var i=0; i<count; i++) {
				var example_question = JSON.parse(JSON.stringify(example_question_base));
				var example_answer = JSON.parse(JSON.stringify(answers[Math.floor(Math.random()*answers.length)]));

				console.log("Merging: Q[" + example_question.text + "] with A[" + example_answer.text + "]")

				if(example_question.text.indexOf("_") == -1) {
					example_question.text += '<br /><br /><span>' + example_answer.text + "</span>";
				} else {
					example_question.text = example_question.text.replace("_", "<span>" + example_answer.text.replace(/[!.?]/, "") + "</span>");
				}

				examples.push(example_question);
			}

			res.json(examples);
		}
	}
}