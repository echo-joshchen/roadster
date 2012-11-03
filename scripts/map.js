var SanFrancisco = [37.796763,-122.422234,"San Francisco"];
var SanDiego = [32.717977,-117.158993,"San Diego"];
var MBAcquarium = [36.618051,-121.902061,"Monterey Bay Aquarium"];
var PismoBeach = [35.086115,-120.622912,"Pismo Beach"];
var Disneyland = [33.809391,-117.918924,"Disneyland"];
var SpindriftInn = [36.615889,-121.899773, "Spindrift Inn"];
var OceanoInn = [35.107091,-120.623355, "Oceano Inn"];
var AnaheimExpressInn = [33.795998,-117.916062, "Anaheim Express Inn"];
var pointsToAdd = [MBAcquarium, PismoBeach, Disneyland, SpindriftInn, OceanoInn, AnaheimExpressInn];
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
			origin: origin.slice(0, 2),
			destination: path[i].slice(0, 2),
			travelMode: 'driving',
			strokeColor: '#CC0000',
			strokeOpacity: 0.6,
			strokeWeight: 6
		});
		origin = path[i];
	}
	map.drawRoute({
		origin: origin.slice(0, 2),
		destination: SanDiego.slice(0, 2),
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
	document.getElementById("searchResults").innerHTML = "";
	map.removeMarkers();
	addRouteMarkers();
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
						infoWindow: {
							content: '<p>'+place.name+'</p>'
						}
					});
					var li = document.createElement("li");
					var add = document.createElement("button");
					add.setAttribute('onclick', 'addPoint(pointsToAdd.shift());');
					var text = document.createTextNode("+");
					add.appendChild(text);
					li.appendChild(add);
					text = document.createTextNode(place.name);
					li.appendChild(text);
					document.getElementById("searchResults").appendChild(li);
				}
			}
		}
	});
	map.setCenter(coord[0], coord[1]);
	map.setZoom(13);
}

// Adds back the markers for the route, after the search markers are deleted.
// I didn't find a way to delete certain markers, so I'm resorting to this method.
function addRouteMarkers() {
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
	for (var i = 0; i < path.length; i++) {
		map.addMarker({
			lat: path[i][0],
			lng: path[i][1],
			title: path[i][2]
		});
	}
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


	// Adds search button event handler.
	$("#submit").click(function() {
		search(pointsToSearch.shift(), document.getElementById("keyword").value);
	});

	$("#reset").click(function() {
		map.removeMarkers();
		addRouteMarkers();
	});
});
