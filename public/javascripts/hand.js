var cards = [];

$(document).ready(function() {

    var list = $("#cards");

    list.owlCarousel({
        pagination : false
    });

    updateHand();
});

function updateHand() {

	$.get("/game/updatecards", function(data, error) {
		alert(data);
	});

}
