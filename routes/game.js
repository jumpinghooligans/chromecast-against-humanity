var mongoose = require('mongoose');

exports.list = function(req, res) {
	var response = {};

	res.render("game", { response : response });
}