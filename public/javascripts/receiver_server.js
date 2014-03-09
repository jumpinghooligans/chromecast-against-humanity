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
	var fadeTime = 250;
	var card = $("<div></div>");
	$(card).addClass("card question");

	var textEle = $("<div></div>");
	$(textEle).html(text);
	$(textEle).addClass("text");

	$(card).append(textEle);

	$(card).css("opacity", "0");
	$(card).css("bottom", "-100px");
	$("#examples").append(card);


	setTimeout(function() {
		$(card).animate({
			opacity : 1,
			bottom : 0
		}, 500);
	}, index * fadeTime);
}