var SanFrancisco = [37.796763,-122.422234,"San Francisco"];
var SanDiego = [32.717977,-117.158993,"San Diego"];
var MBAcquarium = [36.618051,-121.902061,"Monterey Bay Aquarium"];
var PismoBeach = [35.086115,-120.622912,"Pismo Beach"];
var Disneyland = [33.809391,-117.918924,"Disneyland"];
var pointsToAdd = [MBAcquarium, PismoBeach, Disneyland];
var pointsToSearch = [MBAcquarium, PismoBeach, Disneyland];
var searchNearValues = [MBAcquarium[2], PismoBeach[2], Disneyland[2]];
var map;
var path = [];


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
	document.getElementById("stops").innerHTML += "<li>" + coord[2] + "</li>";
	renderRoute();
}

// Renders the route.
function renderRoute() {
	map.cleanRoute();
	var origin = SanFrancisco;
	for (var i = 0; i < path.length; i++) {
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

// Updates the path after reordering.
function updatePath() {
	var stops = document.getElementById("stops").children;
	var newPath = [];
	for (var i = 0; i < stops.length; i++) {
		for (var j = 0; j < path.length; j++) {
			if (stops[i].innerHTML == path[j][2]) {
				newPath.push(path[j]);
			}
		}
	}
	path = newPath;
}

// Adjusts map and sidebar to respond to a search.
function search(coord, value) {
	map.addLayer('places', {
		location: new google.maps.LatLng(coord[0], coord[1]),
		radius: 10000,
		keyword: value,
		search: function (results, status) {
			if (status == google.maps.places.PlacesServiceStatus.OK) {
				for (var i = 0; i < results.length; i++) {
					var place = results[i];
					map.addMarker({
						lat: place.geometry.location.lat(),
						lng: place.geometry.location.lng(),
						title: place.name,
						size: 'small',
						infoWindow: {
							content: '<h2>'+place.name+'</h2>'
						}
					});
				}
			}
		}
	});
	map.setCenter(coord[0], coord[1]);
	map.setZoom(15);
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
			$("#searchbar").show();
			$("#itinerary").hide();
			document.getElementById("near").value = searchNearValues.shift();
		}
	});

	// Add drag-drop functionality to lists.
	$("#stops").dragsort({
		dragSelector: "li",
		dragBetween: false,
		dragEnd: function() {
			updatePath();
			renderRoute();
		},
		placeHolderTemplate: ""
	});

	$("#searchbar").hide();

	$("#submit").click(function() {
		search(pointsToSearch.shift(), document.getElementById("keyword").value);
	});
});
