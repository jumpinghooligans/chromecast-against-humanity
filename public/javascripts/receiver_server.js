var socket;

$(document).ready(function() {
	socket = io.connect('http://chromecast-against-humanity.herokuapp.com/');

	socket.emit('receiver-message', { data : navigator.userAgent });
});

function updateServer(text) {
	socket.emit('receiver-message', { data : text });
}

function getExampels(count) {
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