var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({

	username : String,
	password : String

});

mongoose.model("User", userSchema);

var cardSchema = new mongoose.Schema({

	cardType : String,
	text : { type : String, 'unique' : true },
	numAnswers : Number,
	expansion : String

});

mongoose.model("Card", cardSchema);

console.log("Connecting to: " + global.dbURL);

mongoose.connect(global.dbURL);