var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({

	username : { type : String, 'unique' : true },
	password : String

});

mongoose.model("User", userSchema);

var gameSchema = new mongoose.Schema({

	name : { type : String, 'unique' : true },
	stage : { type : String, default : 'ready' },
	creator : String

});

mongoose.model("Game", gameSchema);

var cardSchema = new mongoose.Schema({

	cardType : String,
	text : { type : String, 'unique' : true },
	numAnswers : Number,
	expansion : String

});

mongoose.model("Card", cardSchema);

console.log("Connecting to: " + global.dbURL);
mongoose.connect(global.dbURL);