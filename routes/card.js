var mongoose = require('mongoose');

var cardSource = require('../cards')

exports.list = function(req, res) {

	var questions = [];
	var answers = [];

	for(var i=0; i<cardSource.masterCards.length; i++) {
		if(cardSource.masterCards[i].cardType === "A") {
			answers.push(cardSource.masterCards[i]);
		} else {
			questions.push(cardSource.masterCards[i]);
		}
	}

	res.render("cards", { questions : questions, answers : answers });
}