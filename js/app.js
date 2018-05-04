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
		zoom: 11,
		mapTypeControl: false,
		styles: [
            {elementType: 'geometry', stylers: [{color: '#93ACB5'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#93ACB5'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#4D4847'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#EFF6E0'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#F5E0B7'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#A63A50'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#104547'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#EFF1F3'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#F05D5E'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#2E4756'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#DBC2CF'}]
            }
          ]
	});
}

// alerts the user if Google Maps fails to load
function googleError() {
    alert('Google Maps has failed to load. Please check your internet connection or try again later.');
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

	// This will be our standard listing marker icon
	var highlightedIcon = makeMarkerIcon('FFE19C');

	// This will be the "highlighted location" marker color for when user mouses over the marker
	var defaultIcon = makeMarkerIcon('FF784F');

	// creating the markers for each object in the locationsList array
	self.locationsList.forEach(function(locItem) {
		locItem.marker = new google.maps.Marker({
			map: map,
			animation: google.maps.Animation.DROP,
			icon: defaultIcon,
			position: locItem.location,
		});
		// ---Add event listeners---
		// Mousover listener for highlightedIcon
		locItem.marker.addListener('mouseover', function() {
			this.setIcon(highlightedIcon);
		});

		// mouseout to set back to default
		locItem.marker.addListener('mouseout', function() {
			this.setIcon(defaultIcon);
		});

		$.ajax({
			type: "GET",
			url: 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' + flickrClientID + '&text=' + locItem.title + '&sort=interestingness-desc&per_page=10&format=json',
			dataType: "jsonp",
			jsonp: 'jsoncallback',
			success: function(data) {
				console.log(data);
				// Consolidating the data into a variable
				var result = data;

				// Array to store the other images.
				this.contentArray = [];
				// Consolidating the start of the flickr api code into a variable
				var number = result.photos.photo;
				for (var p = 1; p < result.photos.photo.length; p++) {
						var contentString = '<div class="carousel-item" id="infowindow">' +
							'<h6>' + locItem.title + '</h6>' +
							'<img class="d-block w-100" alt="Secondary Slide" src="https://farm' + number[p]['farm'] + '.staticflickr.com/' + number[p]['server'] + '/' + number[p]['id'] + '_' + number[p]['secret'] + '.jpg"/>' +
							'<p>Flickr <i class="fab fa-flickr"></i></p>' +
						'</div>';
						this.contentArray.push(contentString);
					}

				// First content for primary image, and bootstrap carousel data
				locItem.contentFirst = '<div id="flickrCarousel" class="carousel slide" data-ride="carousel">' + 
					'<div class="carousel-inner">' + 
						'<div class="carousel-item active" id="infowindow">' +
							'<h6>' + locItem.title + '</h6>' +
							'<img class="d-block w-100" alt="Primary Slide" src="https://farm' + number[0]['farm'] + '.staticflickr.com/' + number[0]['server'] + '/' + number[0]['id'] + '_' + number[0]['secret'] + '.jpg"/>' +
								'<p>Flickr <i class="fab fa-flickr"></i></p>' +
						'</div>' +
						this.contentArray.join("") +
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

				locItem.infowindow = new google.maps.InfoWindow({
					content: locItem.contentFirst
				});

			},
			error: function(){
				alert("Failed to retrieve the information from Flickr. Please check your internet connection, or try again later.");
			}
		});
		
		// listens for clicks on the marker and then executes... 			
		locItem.marker.addListener('click', function() {
			infowindow.open(map, locItem.marker);
		    infowindow.setContent(locItem.contentFirst);
		});
	});

	this.displayInfo = function(locItem) {
        infowindow.open(map, locItem.marker);
	    infowindow.setContent(locItem.contentFirst);
	    locItem.marker.setIcon(highlightedIcon);
	};

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

	// This function takes in a COLOR, and then creates a new marker
	// icon of that color. The icon will be 21 px wide by 34 high, have an origin
	// of 0, 0 and be anchored at 10, 34).
	function makeMarkerIcon(markerColor) {
	var markerImage = new google.maps.MarkerImage(
		'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
		'|40|_|%E2%80%A2',
		new google.maps.Size(21, 34),
		new google.maps.Point(0, 0),
		new google.maps.Point(10, 34),
		new google.maps.Size(21,34));
	return markerImage;
	}
}

var initApp = function() {
	initMap();
	ko.applyBindings(new ViewModel());
};
