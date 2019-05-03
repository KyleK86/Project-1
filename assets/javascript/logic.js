// Initialize Firebase
var config = {
	apiKey: "AIzaSyBOyHz9lESYUIk5wGDidBsfohbE8TQq-y4",
	authDomain: "travel-spy-treez-1556572026545.firebaseapp.com",
	databaseURL: "https://travel-spy-treez-1556572026545.firebaseio.com",
	projectId: "travel-spy-treez-1556572026545",
	storageBucket: "travel-spy-treez-1556572026545.appspot.com",
	messagingSenderId: "460774115127"
};
firebase.initializeApp(config);
var database = firebase.database();


// References
var dbUserObject = firebase.database().ref().child('users')
var dbUserFav = dbUserObject.child('favorites')

// Synchronize database object
// dbUserObject.on('value', snap => console.log(snap.val()));
// // Synchronize database user 'favorites' when item is added
// dbUserFav.on('child_added', snap => console.log(snap.val()));
// Synchronize database user 'favorites' when item is changed
// Synchronize database user 'favorites' when item is removed

//CLICK FUNCTION TO ADD FAVORITE TO DATABASE
$(document).on('click', '.fa-heart', function () {
	let camURL = $(this).attr('data-url');
	let userID = firebase.auth().currentUser.uid;
	let user = firebase.database().ref("users/" + userID);
	user.child('favorites').push(camURL);

	// for (var i = 0;i<dbUserFav.length;i++){

	// }



})

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
		let geoData = response.results[0];
		// Test / Debug
		// console.log(geoData);

		let longitude = geoData.geometry.location.lng;
		let latitude = geoData.geometry.location.lat;
		let coordinates = latitude + "," + longitude + ",1000";
		getCams(coordinates);
	});
});

// Variable to hold RapidAPI key
let rapidKey = '0eacac436dmsh7800f72af242e86p18514cjsnf1fb610b79fb';

// Function to retrieve webcams based on the converted location (coordinates) produced by Geocoding
function getCams(coordinates) {
	let show = 'image,player,location'
	let queryURL = 'https://webcamstravel.p.rapidapi.com/webcams/list/property=day,hd/nearby=' + coordinates + '/orderby=distance/limit=9?show=categories;webcams:' + show;

	$.ajax({
		url: queryURL,
		method: 'GET',
		contentType: 'application/json; charset=utf-8',
		headers: {
			"X-RapidAPI-Key": rapidKey,
			"X-RapidAPI-Host": "webcamstravel.p.rapidapi.com"
		}
	}).then(function (responseCam) {
		let data = responseCam.result;
		// Create div to display contents to HTML
		let dataDiv = $("<div>").addClass("dataDiv");
		// Test / Debug
		// console.log(data);


		// Iterate and parse through data
		for (var i = 0; i < data.webcams.length; i++) {
			// Create variables to hold webcam location
			let region = data.webcams[i].location.region;
			let city = data.webcams[i].location.city;
			let location = region + ", " + city;

			// Dynamically create a Bootstrap image card to display each webcam preview
			let card = $("<div>").addClass("card");
			let imgLink = $("<a>").addClass("img-link").attr("href", data.webcams[i].player.year.embed).attr("target", "_blank");
			let cardImg = $("<img>").addClass("webcam").addClass("card-img-top");
			cardImg.attr("src", data.webcams[i].image.current.preview).attr("alt", data.webcams[i].title);
			let cardBody = $("<div>").addClass("card-body");
			let cardTitle = $("<p>").addClass("card-title").text(location);
			let cardText = $("<p>").addClass("card-text");
			let button = $("<a>").addClass("travel-btn btn btn-dark py-1");
			button.text("Take me here!");
			let favIcon = $("<i>").addClass("px-2 fas fa-heart");
			favIcon.attr("data-url", data.webcams[i].player.year.embed);
			favIcon.attr("data-img", data.webcams[i].image.current.preview);




			// Build card
			cardBody.append(cardTitle);
			cardBody.append(cardText);
			cardBody.append(button);
			cardBody.append(favIcon);
			imgLink.append(cardImg)
			card.append(cardBody);
			card.prepend(imgLink);


			// Attach card to div
			dataDiv.append(card);
		}
		// Empty HTML div and display "dataDiv" containing cards
		$('.webcam-div').empty();
		$('.webcam-div').prepend(dataDiv);
	});
}
// Click function that makes Ajax call to retrieve flight information
$(document).on("click", ".travel-btn", function () {
	event.preventDefault();
	$.ajax({
		url: "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/pricing/v1.0",
		method: "POST",
		headers: {
			"X-RapidAPI-Host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
			"X-RapidAPI-Key": rapidKey
		},
		data: {
			"country": "US",
			"currency": "USD",
			"locale": "en-US",
			"LHR-sky": "2019-09-1",
			"adults": 1
		},
	}).then(function (response) {
		console.log(response);
	})
})

// Logout Function
$(document).on("click", "#logout-btn", function () {
	firebase.auth().signOut().then(function () {
		$("#login-btn").show();
		$("#logout-btn").hide();
		$("#account-btn").hide();
		$("#fav-btn").hide();
		$("#categories-btn").hide();
		$("#pop-btn").hide();
	}, function (error) {
		console.error('Sign Out Error', error);
	});
});


// TODO:
// .done(function to render travel options to html)
//function on button-clicked "add to favorites" to add webcam to profile favorites list in firebase
//function to grab the favorites list from firebase profile section