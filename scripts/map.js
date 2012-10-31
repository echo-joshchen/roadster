var SanFrancisco = [37.796763,-122.422234];
var SanDiego = [32.717977,-117.158993];
var MBAcquarium = [36.618051,-121.902061];
var PismoBeach = [35.086115,-120.622912];
var Disneyland = [33.809391,-117.918924];
var pointsToAdd = [MBAcquarium, PismoBeach, Disneyland];
var map;
var path = [SanFrancisco];


// Creates the initial map from SF to SD.
function createMap() {
	map = new GMaps({
		el: '#map',
		lat: SanFrancisco[0],
		lng: SanFrancisco[1],
		zoom: 8,
	});
	map.addMarker({
		lat: SanFrancisco[0],
		lng: SanFrancisco[1],
		title: "Start Location: San Francisco",
	});
	map.addMarker({
		lat: SanDiego[0],
		lng: SanDiego[1],
		title: "End Location: San Diego",
	});
	map.drawRoute({
		origin: SanFrancisco,
		destination: SanDiego,
		travelMode: 'driving',
		strokeColor: '#CC0000',
		strokeOpacity: 0.6,
		strokeWeight: 6
	});
}

// Add another location to map.
function addPoint(coord) {
	map.addMarker({
		lat: coord[0],
		lng: coord[1],
	});
	path.push(coord);
	renderRoute();
}

// Renders the route.
function renderRoute() {
	map.cleanRoute();
	var origin = path[0];
	for (var i = 1; i < path.length; i++) {
		map.drawRoute({
			origin: origin,
			destination: path[i],
			travelMode: 'driving',
			strokeColor: '#CC0000',
			strokeOpacity: 0.6,
			strokeWeight: 6
		});
		origin = path[i];
	}
	map.drawRoute({
		origin: origin,
		destination: SanDiego,
		travelMode: 'driving',
		strokeColor: '#CC0000',
		strokeOpacity: 0.6,
		strokeWeight: 6
	});
}

$(document).ready(function(){

	createMap();

	// Adds context menu event for right-click on map.
	$("#map").contextMenu({
		menu: "optionsMenu"
	}, function(action, el, pos) {
		if (action == "add_location") {
			// I'm not sure how to get the coords for this event, so I hard-coded it.
			addPoint(pointsToAdd.shift());
		} else if (action == "search") {
			// IMPLEMENT SEARCH FUNCTIONALITY
			alert('Search coming soon');
		}
	});

});