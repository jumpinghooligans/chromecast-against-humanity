var mongoose = require('mongoose');

exports.list = function(req, res) {
	var response = {};

	res.render("game", { response : response });
}

exports.hand = function(req, res) {
	var response = {};

	res.render("game/hand", { response : response });
}