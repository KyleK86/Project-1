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
// function to make ajax call to webcams.travel
$(document).on('click', '#search-btn', function () {
	event.preventDefault();
	let webcamKey = '0eacac436dmsh7800f72af242e86p18514cjsnf1fb610b79fb';
	let coordinates = $('#search-bar').val().trim();
	let orderBy = 'distance';
	let webcamHost = 'https://webcamstravel.p.rapidapi.com/webcams/list/property=live/nearby=' + coordinates + '/orderby=' + orderBy + '/limit=20?show=webcams:player';
	$.ajax({
		url: webcamHost,
		method: 'GET',
		headers: {
			"X-RapidAPI-Key": webcamKey,
			"X-RapidAPI-Host": "webcamstravel.p.rapidapi.com"
		}
	}).then(function (response) {
		console.log(response);
		source = response.result.webcams[0].player.live.embed;
		$('.webcam').html('<embed src=' + source + '>');
	});
});



//.done(function to render nearest webcam and list of nearby cams to html)

// function to make ajax call to travel agency API
// .done(function to render travel options to html)

//function on button-clicked "add to favorites" to add webcam to profile favorites list in firebase
//function to grab the favorites list from firebase profile section

//handle auth.