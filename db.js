var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({

	username : String,
	password : String

});

mongoose.model("User", userSchema);

var cardSchema = new mongoose.Schema({

	cardType : String,
	text : String,
	numAnswers : Number,
	expansion : String

});

mongoose.model("Card", cardSchema);

console.log("Connecting to: " + global.dbURL);

mongoose.connect(global.dbURL);