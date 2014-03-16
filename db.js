var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({

	username : { type : String, 'unique' : true },
	password : String

});

mongoose.model("User", userSchema);

var gameSchema = new mongoose.Schema({

	name : { type : String, unique : true },
	stage : { type : String, default : 'ready' },
	players : [{
		username : String,
		status : { type : String, default : "not ready" },
		points : { type : Number, default : 0 }
	}],
	chromecasts : [{
		username : String
	}],
	rounds : [{
		picker : String, //who chooses the winner
		winner : String //who actually won
	}],
	cards : [{
		id : String, //what card
		location : String //players hand or discard
	}],
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