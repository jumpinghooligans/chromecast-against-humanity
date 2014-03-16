var mongoose = require('mongoose');

exports.list = function(req, res){
	var response = {};

	var User = mongoose.model("User");

	User.find({}, function(err, users) {
		if(err) {
			req.flash('error', err);
			res.redirect('/');
		} else {
			complete(users);
		}
	});

	var complete = function(users) {
		response.users = users;
		res.render("users", { response : response });
	}
};

exports.create = function(req, res) {
	var response = {};

	if(req.method == "POST") {
		var data = req.body;
		var User = mongoose.model("User");

		var u = new User(data);
		u.save(function(err, user) {
			if(err) {
				req.flash('error', err.err);
				res.redirect("users/create");
			} else {
				req.session.activeuser = user;
				
				req.flash('message', "Successfully created user: " + user.username);
				res.redirect("users/" + user.username);
			}
		});
	} else {
		res.render("users/create", { response : response });
	}
}

exports.login = function(req, res) {
	var response = {};

	if(req.method == "POST") {
		var data = req.body;
		var User = mongoose.model("User");

		User.findOne({ username : data.username, password : data.password }, function(err, user) {
			if(err) {
				req.flash('error', err.err);
				res.redirect("users/login");
			}
			if(user) {
				req.session.activeuser = user;
				var redirect = (req.query.redirect) ? req.query.redirect : "/";
				res.redirect(redirect);
			} else {
				var redirect = (req.query.redirect) ? req.query.redirect : "/";

				req.flash('error', 'Invalid username or password.');
				res.redirect("users/login?redirect=" + redirect);
			}
		});
	} else {
		if(req.session.activeuser) {
			req.flash('message', 'You are already logged in');
			res.redirect('/users/' + req.session.activeuser.username);
		} else {
			res.render("users/login", { response : response });
		}
	}
}

exports.logout = function(req, res) {
	console.log("Logging out: " + req.session.activeuser.username);
	console.log(req.session.activeuser);
	delete req.session.activeuser;

	req.flash('info', 'Logout successful.');
	res.redirect('/');
}

exports.user = function(req, res){
	var response = {};

	var User = mongoose.model("User");

	User.findOne({ username : req.params.username }, function(err, user) {
		if(err) {
			req.flash('error', err);
			res.redirect('/users');
		} else {
			complete(user);
		}
	});

	var complete = function (user) {
		res.render("users/user", { user : user });
	}
};