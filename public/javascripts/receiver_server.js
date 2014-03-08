var socket;

$(document).ready(function() {
	socket = io.connect('http://chromecast-against-humanity.herokuapp.com/');

	socket.emit('receiver-message', { data : navigator.userAgent });
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
			createCard(data[i].text, "");
		}
	});
}

function createCard(text, expansion) {
	var card = $("<div></div>");
	$(card).addClass("card question");

	var textEle = $("<div></div>");
	$(textEle).html(text);
	$(textEle).addClass("text");

	$(card).append(textEle);

	$("#examples").append(card);
}