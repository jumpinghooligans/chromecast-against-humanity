var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({

	username : String,
	password : String

});

mongoose.model("User", userSchema);

console.log(global.dbURL);
mongoose.connect(global.dbURL);