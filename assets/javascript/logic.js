//Get auth tokens once per page load
let authToken;
$.ajax({
	url: "https://test.api.amadeus.com/v1/security/oauth2/token",
	method: "POST",
	headers: {
		"Content-Type": "application/x-www-form-urlencoded"
	},
	data: {
		grant_type: "client_credentials",
		client_id: "ESRG39Ac1pHRKKLRaVVf8zUwscrCfWpz",
		client_secret: "DKoZdVFyAqjzbWYq"
	}

}).then(function (response) {
	authToken = response.access_token;
});

let lufthansaToken;
$.ajax({
	url: "https://api.lufthansa.com/v1/oauth/token",
	method: "POST",
	data: {
		client_id: "hfx529s9n9y4usqmkueb7qug",
		client_secret: "Z39Xqv5sCX",
		grant_type: "client_credentials"
	}
}).then(function (response) {
	console.log(response);
	lufthansaToken = response.access_token;

})

var config = {
	apiKey: "AIzaSyBOyHz9lESYUIk5wGDidBsfohbE8TQq-y4",
	databaseURL: "https://travel-spy-treez-1556572026545.firebaseio.com",
	projectId: "travel-spy-treez-1556572026545",
	storageBucket: "travel-spy-treez-1556572026545.appspot.com",
	messagingSenderId: "460774115127"
};
try {
	firebase.initializeApp(config)
} catch (err) {
	if (!/already exists/.test(err.message)) {
		console.error('Firebase initialization error', err.stack)
	}
}
var database = firebase.database();

// Function that determines the user and retrieves their "favorites" from Firebase to display in dropdown

firebase.auth().onAuthStateChanged(function (user) {
	if (user) {
		var userFavRef = firebase.database().ref('users/' + firebase.auth().currentUser.uid);
		userFavRef.on('child_added', function (snapshot) {
			for (var i in snapshot.val()) {
				// Test / Debug
				// console.log(snapshot.val());

				let fav = $("<p>").text(snapshot.val()[i].camTitle);
				let link = $("<a>").addClass('dropdown-item').attr("href", snapshot.val()[i].camURL).attr("target", "_blank")
				// Apend favorite to link then the link to HTML reference
				link.append(fav);
				$(".fav-drop").append(link);
			}
		})
	}
})

// Click function to add favorites to database and dropdown menu
$(document).on('click', '.fa-heart', function () {
	let camURL = $(this).attr('data-url');
	let camTitle = $(this).attr('data-title');
	let camData = {

		camURL: camURL,
		camTitle: camTitle

	}
	let userID = firebase.auth().currentUser.uid;
	let user = firebase.database().ref("users/" + userID);
	user.child('favorites').push(camData);
});

let longitude;
let latitude;

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
		longitude = geoData.geometry.location.lng;
		latitude = geoData.geometry.location.lat;
		let coordinates = latitude + "," + longitude + ",1000";
		getCams(coordinates);
		getAirports(latitude, longitude);
	});
	let dest = $('#origin-input').val().trim().replace(' ', "+");
	let geocodeHost2 = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + dest + '&key=' + geocodeKey;
	$.ajax({
		url: geocodeHost2,
		method: 'GET'
	}).then(function (response) {
		let geoData = response.results[0];
		// Test / Debug
		// console.log(geoData);
		lng = geoData.geometry.location.lng;
		lat = geoData.geometry.location.lat;
		setOrigin(lat, lng);
	});
});

function setOrigin(lat, lng) {
	let qUrl = "https://api.lufthansa.com/v1/references/airports/nearest/" + lat + "," + lng;
	let auth = "Bearer " + lufthansaToken;
	$.ajax({
		url: qUrl,
		headers: {
			Authorization: auth,
			Accept: "application/json"
		},
		method: "GET"
	}).then(function (response) {
		origin = response.NearestAirportResource.Airports.Airport[0].CityCode;
	})
}


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
		console.log(data.categories);

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
			favIcon.attr("data-title", data.webcams[i].title);

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


let dest;

function getAirports(latitude, longitude) {
	let qUrl = "https://api.lufthansa.com/v1/references/airports/nearest/" + latitude + "," + longitude;
	let auth = "Bearer " + lufthansaToken;
	$.ajax({
		url: qUrl,
		headers: {
			Authorization: auth,
			Accept: "application/json"
		},
		method: "GET"
	}).then(function (response) {
		console.log(response);
		dest = response.NearestAirportResource.Airports.Airport[0].CityCode;
	})
}


// Click function to change the color of "favorite" hearts
$(document).on("click", ".fa-heart", function () {
	$(this).attr("style", "color:aqua");
})

// Click function that makes Ajax call to retrieve flight information
$(document).on("click", ".travel-btn", function () {
	event.preventDefault();

	let bookingQuery = "https://test.api.amadeus.com/v1/shopping/flight-offers?origin=" + origin + "&destination=" + dest + "&departureDate=2019-08-01";

	$.ajax({
		headers: {
			Authorization: "Bearer " + authToken

		},
		url: bookingQuery,
		method: "GET"
	}).then(function (response) {
		console.log(response);
		console.log(response.data[3].offerItems);
		for (var i in response.data) {
			var newRow = $("<tr>").append(
				$("<td>").text(response.data[i].offerItems[0].price.total),
				$("<td>").text(response.data[i].offerItems[0].services[0].segments[0].flightSegment.carrierCode),
				$("<td>").text(response.data[i].offerItems[0].services[0].segments[0].pricingDetailPerAdult.availability),
			);
			// Display the travel info in modal by appending div
			$("#travel-table-data > tbody").append(newRow);
		}
		$('#modal-travel').modal('show');

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
		$(".webcam-div").empty();
	}, function (error) {
		console.error('Sign Out Error', error);
	});
});