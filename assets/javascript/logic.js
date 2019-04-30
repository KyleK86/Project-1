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


// Function to make ajax call with user input and populate 10 webcam previews based on distance

$(document).on('click', '#search-btn', function () {
	event.preventDefault();

	let geocodeKey = 'AIzaSyC2z-v8BYL87BcckVHVlaHh2kMPsauIln4'
	let destination = $('#search-bar').val().trim().replace(' ', "+");
	let geocodeHost = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + destination + '&key=' + geocodeKey;
	$.ajax({
		url: geocodeHost,
		method: 'GET'
	}).then(function (response) {
		// console.log(response);
		let longitude = response.results[0].geometry.location.lng;
		let latitude = response.results[0].geometry.location.lat;
		let coordinates = longitude + "," + latitude + ",1000";

		console.log(coordinates);
		getCams(coordinates);
	});
});

function getCams(coordinates) {
	let webcamKey = '0eacac436dmsh7800f72af242e86p18514cjsnf1fb610b79fb';
	let queryURL = 'https://webcamstravel.p.rapidapi.com/webcams/list/property=live/nearby=' + coordinates + '/orderby=distance/limit=24?show=webcams:image,player,location';
	$.ajax({
		url: queryURL,
		method: 'GET',
		headers: {
			"X-RapidAPI-Key": webcamKey,
			"X-RapidAPI-Host": "webcamstravel.p.rapidapi.com"
		}
	}).then(function (responseCam) {
		// Create variable to hold response data
		let data = responseCam.result
		// Test / Debug
		// console.log(data);
		console.log(responseCam);
		

		// // Create div to display contents to HTML
		// let dataDiv = $("<div>");
		// dataDiv.addClass("dataDiv");

		// // Iterate and parse through data
		// for (var i = 0; i < data.webcams.length; i++) {
		// 	// Create div to hold each of the data results contents
		// 	let dataResult = $("<div>");
		// 	dataResult.addClass("dataResult");

		// 	// Create variables to hold webcam location and HTML ref
		// 	let country = data.webcams[i].location.country;
		// 	let city = data.webcams[i].location.city;
		// 	let location = "<small>" + country + ", " + city + "</small>";

		// 	// Create an anchor tag to nest each webcam preview and make them links
		// 	let webcamURL = $("<a>");
		// 	webcamURL.addClass("url");
		// 	webcamURL.attr("href", data.webcams[i].player.live.embed);
		// 	webcamURL.attr("target", "_blank");

		// 	// Create an img tag to display each webcam preview
		// 	let previewTag = $("<img>");
		// 	previewTag.addClass("webcam");
		// 	previewTag.attr("src", data.webcams[i].image.current.preview);
		// 	previewTag.attr("alt", data.webcams[i].title);


		// 	webcamURL.prepend(previewTag);
		// 	// Prepend webcam and location to "dataResult"
		// 	dataResult.prepend(webcamURL);
		// 	dataResult.prepend(location);
		// 	// Prepend "dataResult" to "dataDiv"
		// 	dataDiv.prepend(dataResult);
		// }
		// // Display "dataDiv" containing all contents to HTML
		// $('.webcam-div').prepend(dataDiv);
	});
}



//.done(function to render nearest webcam and list of nearby cams to html)

// function to make ajax call to travel agency API
// .done(function to render travel options to html)

//function on button-clicked "add to favorites" to add webcam to profile favorites list in firebase
//function to grab the favorites list from firebase profile section

//handle auth.