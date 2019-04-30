
// Initialize Firebase
let config = {
	apiKey: "AIzaSyA_VBvhCQwkbk792q9BVCv19uC-SAMm8-M",
	authDomain: "kjw-project-1.firebaseapp.com",
	databaseURL: "https://kjw-project-1.firebaseio.com",
	projectId: "kjw-project-1",
	storageBucket: "kjw-project-1.appspot.com",
	messagingSenderId: "1048382006751"
};
firebase.initializeApp(config);
let database = firebase.database;

// Click function populates 9 webcams that are sorted by distance based on user input
$(document).on('click', '#search-btn', function () {
	event.preventDefault();
	// Google Maps Geocoding ajax call converts normal address or location in to coordinates
	let geocodeKey = 'AIzaSyC2z-v8BYL87BcckVHVlaHh2kMPsauIln4'
	let destination = $('#search-bar').val().trim().replace(' ', "+");
	let geocodeHost = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + destination + '&key=' + geocodeKey;
	$.ajax({
		url: geocodeHost,
		method: 'GET'
	}).then(function (response) {
		// Test / Debug
		console.log(response);
		let longitude = response.results[0].geometry.location.lng;
		let latitude = response.results[0].geometry.location.lat;
		let coordinates = latitude + "," + longitude+ ",1000";
		getCams(coordinates);
	});
});

// Function to retrieve webcams based on the converted location (coordinates) produced by Geocoding
function getCams(coordinates) {
	let webcamKey = '0eacac436dmsh7800f72af242e86p18514cjsnf1fb610b79fb';
	let queryURL = 'https://webcamstravel.p.rapidapi.com/webcams/list/property=live/nearby=' + coordinates + '/orderby=distance/limit=9?show=webcams:image,player,location';
	$.ajax({
		url: queryURL,
		method: 'GET',
		contentType: 'application/json; charset=utf-8',
		headers: {
			"X-RapidAPI-Key": webcamKey,
			"X-RapidAPI-Host": "webcamstravel.p.rapidapi.com"
		}
	}).then(function (responseCam) {
		let data = responseCam.result;
		// Create div to display contents to HTML
		let dataDiv = $("<div>");
		dataDiv.addClass("dataDiv");
		// Test / Debug
		// console.log(responseCam);
		// console.log(data);

		// Iterate and parse through data
		for (var i = 0; i < data.webcams.length; i++) {
			// Create variables to hold webcam location
			let region = data.webcams[i].location.region;
			let city = data.webcams[i].location.city;
			let location = region + ", " + city;

			// Dynamically create a Bootstrap image card to display each webcam preview
			let card = $("<div>").addClass("card");
			let cardImg = $("<img>").addClass("webcam").addClass("card-img-top");
			cardImg.attr("src", data.webcams[i].image.current.preview).attr("alt", data.webcams[i].title);
			let cardBody = $("<div>").addClass("card-body");
			let cardTitle = $("<p>").addClass("card-title").text(location);
			let cardText = $("<p>").addClass("card-text");
			let button = $("<a>").addClass("btn btn-dark py-1")
			button.attr("href", data.webcams[i].player.live.embed).attr("target", "_blank");
			button.text("Take me here!");
			
			// Build card
			cardBody.append(cardTitle);
			cardBody.append(cardText);
			cardBody.append(button);
			card.append(cardBody);
			card.prepend(cardImg);
			// Attach to div
			dataDiv.prepend(card);
		}
		// Display "dataDiv" containing card to HTML
		$('.webcam-div').append(dataDiv);
	});
}


//.done(function to render nearest webcam and list of nearby cams to html)

// function to make ajax call to travel agency API
// .done(function to render travel options to html)

//function on button-clicked "add to favorites" to add webcam to profile favorites list in firebase
//function to grab the favorites list from firebase profile section

//handle auth.