// These are the places most popular tourist destinations that will be shown to the user.
var locations = [
	{
		title: 'Playa Blanca, Baru, Cartagena',
		location: {lat: 10.219255, lng: -75.611843}
	},
	{
		title: 'Castillo de San Felipe de Barajas, Cartagena',
		location: {lat: 10.422717, lng:  -75.539271}
	},
	{
		title: 'Rosario Islands, Bolivar',
		location: {lat: 10.179721, lng: -75.771547}
	},
	{
		title: 'Palace of Inquisition, Cartagena',
		location: {lat: 10.423210, lng: -75.551577}
	},
	{
		title: 'Las Bovedas, Cartagena',
		location: {lat: 10.4301723, lng: -75.551587}
	}];

// make a variable for the map
var map;

var markers = [];

// Initialize the map function
function initMap() {
	// Constructor creates a new map - only center and zoom are required.
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 10.3725951, lng: -75.6281321},
		zoom: 11
	});
}

var LocModel = function(data) {
	// creating observable arrays for implementation into the DOM
	this.title = data.title;
	this.location = data.location;
	this.marker = null;
	this.favorite = false;
};



var ViewModel = function() {
	var self = this;

	var flickrClientID = '875ad6a0743ed07d536b10e4f653791a';
	var flickrClientSecret = 'ca92b4377d46bcee';

	// This is the locations array
	this.locationsList = [];

	// This function gets the locations from the 'locations' array
	// Then pushes it to the observableArray
	locations.forEach(function(locItem){
		self.locationsList.push( new LocModel(locItem));
	});

	// Creating an info window variable for future reference
	var infowindow = new google.maps.InfoWindow({
		maxWidth: 250
	});

	// creating the markers for each object in the locationsList array
	self.locationsList.forEach(function(locItem) {
		locItem.marker = new google.maps.Marker({
			map: map,
			animation: google.maps.Animation.DROP,
			position: locItem.location,
		});
				// Add event listeners

		// FAIL exception

		locItem.marker.addListener('click', function() {
			$.ajax({
				type: "GET",
				url: 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' + flickrClientID + '&text=' + locItem.title + '&sort=interestingness-desc&per_page=10&format=json',
				dataType: "jsonp",
				jsonp: 'jsoncallback',
				success: function(data) {
					console.log(data);
					// Shorten and confirm valid json responses for appending photos
					// var farmId = ph.farm;
					// var serverId = ph.server;
					// var id = ph.id;
					// var secret = ph.secret;
					// Consolidating the data into a variable
					var result = data;
					// Consolidating the start of the flickr api code into a variable
					var number = result.photos.photo;
					// First content for primary image, and bootstrap carousel data
					var contentFirst = '<div id="flickrCarousel" class="carousel slide" data-ride="carousel">' + 
						'<div id="append" class="carousel-inner">' + 
							'<div class="carousel-item active">' +
								'<img class="d-block w-100" alt="Primary Slide" src="https://farm' + number[0]['farm'] + '.staticflickr.com/' + number[0]['server'] + '/' + number[0]['id'] + '_' + number[0]['secret'] + '.jpg"/>' +
							'</div>' +
						'</div>' +
						'<a class="carousel-control-prev" href="#flickrCarousel" role="button" data-slide="prev">' +
    						'<span class="carousel-control-prev-icon" aria-hidden="true"></span>' +
						    '<span class="sr-only">Previous</span>' +
						 '</a>' +
						 '<a class="carousel-control-next" href="#flickrCarousel" role="button" data-slide="next">' +
						    '<span class="carousel-control-next-icon" aria-hidden="true"></span>' +
						    '<span class="sr-only">Next</span>' +
						  '</a>' +
					'</div>';
					// <div class="carousel-item active"><img src="https://farm' + number[0]['farm'] + '.staticflickr.com/' + number[0]['server'] + '/' + number[0]['id'] + '_' + number[0]['secret'] + '.jpg"/></div>';
					console.log(contentFirst);
					infowindow.setContent(contentFirst);
					infowindow.open(map, locItem.marker);
					google.maps.event.addListenerOnce(infowindow, 'domready', function() {
						for (var p = 1; p < result.photos.photo.length; p++) {
							var contentString = '<div class="carousel-item"><img class="d-block w-100" alt="Secondary Slide" src="https://farm' + number[p]['farm'] + '.staticflickr.com/' + number[p]['server'] + '/' + number[p]['id'] + '_' + number[p]['secret'] + '.jpg"/></div';
							$( "#append" ).append(contentString);
							console.log(contentString);
						}
					});
				},
				error: function(){
					console.log("the request failed");
				}
			});
		});
	});

	// search and filter array based on user input

	// set-up empty observable array for visible locations
	self.filteredLocations = ko.observableArray();

	// populate the visible locations array with objects from locationsList
	self.locationsList.forEach(function(locItem) {
		self.filteredLocations.push(locItem);
	});

	// set user filter as ko observable
	self.userFilter = ko.observable('');

	// filter function: updates observableArray and
	// sets visibility of location markers
	self.runFilter = function() {
		var queryFilter = self.userFilter().toLowerCase();

		// First, clear the array
		self.filteredLocations.removeAll();

		// Secondly, run the filter and only add to the array if it matches
		self.locationsList.forEach(function(locItem) {

			// set marker to false - hide
			locItem.marker.setVisible(false);

			if(locItem.title.toLowerCase().indexOf(queryFilter) !== -1) {
				self.filteredLocations.push(locItem);
			}
		});

		// set true to each item in the array - visible

		self.filteredLocations().forEach(function(locItem) {
			locItem.marker.setVisible(true);
		});
	};
}

var initApp = function() {
	initMap();
	ko.applyBindings(new ViewModel());
};
