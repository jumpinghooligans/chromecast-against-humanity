$(document).ready(function() {

	$("#header .inner>h1").hover(function() {
		$("#header").addClass("hover");
	}, function() {
		$("#header").removeClass("hover");
	});

    console.log("scripts.js ready.");
});
