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
	// 'For loop' for the locations
	for (var i = 0; i < locations.length; i++) {
		// Get the position from the location array.
		var position = locations[i].location;
		var title = locations[i].title;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i
        });
		// Push the marker to our array of markers.
		markers.push(marker);
	}
}

var LocModel = function(data) {
	// creating observable arrays for implementation into the DOM
	this.title = ko.observable(data.title);
	this.location = ko.observable(data.location);
	this.query = ko.observable("")

}

var ViewModel = function() {
	var self = this;

	this.query = ko.observable('');

	this.filter = ko.computed(function () {
	    if (this.query()) {
	        var search = this.query().toLowerCase();
	        return ko.utils.arrayFilter(this.locationsList(), function (loc) {
	            return loc.title().toLowerCase().indexOf(search) >= 0;
	        });
	    } else {
	        return this.locationsList
	    }}, this);  

	// This is the locations array
	this.locationsList = ko.observableArray([]);

	// This function gets the locations from the 'locations' array
	// Then pushes it to the observableArray
	locations.forEach(function(locItem){
		self.locationsList.push( new LocModel(locItem));
	});
}

ko.applyBindings(new ViewModel());