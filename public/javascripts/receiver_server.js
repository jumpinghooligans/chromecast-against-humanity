var socket;

$(document).ready(function() {
	socket = io.connect('http://chromecast-against-humanity.herokuapp.com/');

	var registration = {};

	registration.game = "example";
	registration.id = "ryan"
	registration.role = "chromecast";

	socket.emit('register', registration);

	socket.on('server-message', function(data) {
		if(data.action == "exampleCards") {
			getExamples(5);
		}
	});
});

function updateServer(text) {
	socket.emit('receiver-message', { data : text });
}

function getExamples(count) {
	$("#examples").html("");

	$.get("/receiver/examples/" + count, function(data) {
		for(var i=0; i<count; i++) {
			createCard(data[i].text, "", i);
		}
	});
}

function createCard(text, expansion, index) {
	var fadeTime = 500;
	var card = $("<div></div>");
	$(card).addClass("card question");

	var textEle = $("<div></div>");
	$(textEle).html(text);
	$(textEle).addClass("text");

	$(card).append(textEle);

	$(card).css("display", "none");
	$("#examples").append(card);


	setTimeout(function() {
		$(card).fadeIn();
	}, index * fadeTime);
}