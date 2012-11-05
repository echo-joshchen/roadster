var Bakersfield = [35.424536,-120.325521,"Bakersfield"];
var SanFrancisco = [37.796763,-122.422234,"San Francisco"];
var SanDiego = [32.717977,-117.158993,"San Diego"];
var MBAcquarium = [36.618051,-121.902061,"Monterey Bay Aquarium"];
var PismoBeach = [35.086115,-120.622912,"Pismo Beach"];
var Disneyland = [33.809391,-117.918924,"Disneyland"];
var SpindriftInn = [36.615889,-121.899773, "Spindrift Inn"];
var SeaVentureHotel = [35.136581,-120.641004, "SeaVenture Hotel"];
var AlpineInn = [33.803578,-117.917597, "Alpine Inn"];
var pointsToAdd = [MBAcquarium, PismoBeach, Disneyland, SpindriftInn, SeaVentureHotel, AlpineInn];
var pointsToSearch = [MBAcquarium, Disneyland, MBAcquarium, MBAcquarium, PismoBeach, PismoBeach, Disneyland, Disneyland];
var path = [];
var num_days = 1;
var driving_time = {};

driving_time["San Francisco,San Francisco"] = 0;
driving_time["San Francisco,San Diego"] = 8.5;
driving_time["San Francisco,Monterey Bay Aquarium"] = 2.25;
driving_time["San Francisco,Pismo Beach"] = 4.25;
driving_time["San Francisco,Disneyland"] = 7;
driving_time["San Francisco,Spindrift Inn"] = 2.25;
driving_time["San Francisco,SeaVenture Hotel"] = 4.25;
driving_time["San Francisco,Alpine Inn"] = 4.25;

driving_time["Monterey Bay Aquarium,San Diego"] = 8;
driving_time["Monterey Bay Aquarium,Monterey Bay Aquarium"] = 0;
driving_time["Monterey Bay Aquarium,Pismo Beach"] = 3;
driving_time["Monterey Bay Aquarium,Disneyland"] = 6.25;
driving_time["Monterey Bay Aquarium,Spindrift Inn"] = 0;
driving_time["Monterey Bay Aquarium,SeaVenture Hotel"] = 3;
driving_time["Monterey Bay Aquarium,Alpine Inn"] = 6.25;

driving_time["Pismo Beach,San Diego"] = 5.25;
driving_time["Pismo Beach,Monterey Bay Aquarium"] = 3;
driving_time["Pismo Beach,Pismo Beach"] = 0;
driving_time["Pismo Beach,Disneyland"] = 3.75;
driving_time["Pismo Beach,Spindrift Inn"] = 3;
driving_time["Pismo Beach,SeaVenture Hotel"] = 0;
driving_time["Pismo Beach,Alpine Inn"] = 3.75;

driving_time["Disneyland,San Diego"] = 1.75;
driving_time["Disneyland,Monterey Bay Aquarium"] = 6.25;
driving_time["Disneyland,Pismo Beach"] = 3.75;
driving_time["Disneyland,Disneyland"] = 0;
driving_time["Disneyland,Spindrift Inn"] = 6.25;
driving_time["Disneyland,SeaVenture Hotel"] = 3.75;
driving_time["Disneyland,Alpine Inn"] = 0;

driving_time["Spindrift Inn,San Diego"] = 8;
driving_time["Spindrift Inn,Monterey Bay Aquarium"] = 0;
driving_time["Spindrift Inn,Pismo Beach"] = 3;
driving_time["Spindrift Inn,Disneyland"] = 6.25;
driving_time["Spindrift Inn,Spindrift Inn"] = 0;
driving_time["Spindrift Inn,SeaVenture Hotel"] = 3;
driving_time["Spindrift Inn,Alpine Inn"] = 6.25;

driving_time["SeaVenture Hotel,San Diego"] = 5.25;
driving_time["SeaVenture Hotel,Monterey Bay Aquarium"] = 3;
driving_time["SeaVenture Hotel,Pismo Beach"] = 0;
driving_time["SeaVenture Hotel,Disneyland"] = 3.75;
driving_time["SeaVenture Hotel,Spindrift Inn"] = 3;
driving_time["SeaVenture Hotel,SeaVenture Hotel"] = 0;
driving_time["SeaVenture Hotel,Alpine Inn"] = 3.75;

driving_time["Alpine Inn,San Diego"] = 1.75;
driving_time["Alpine Inn,Monterey Bay Aquarium"] = 6.25;
driving_time["Alpine Inn,Pismo Beach"] = 3.75;
driving_time["Alpine Inn,Disneyland"] = 0;
driving_time["Alpine Inn,Spindrift Inn"] = 6.25;
driving_time["Alpine Inn,SeaVenture Hotel"] = 3.75;
driving_time["Alpine Inn,Alpine Inn"] = 0;

// Creates the initial map from SF to SD.
function createMap() {
	map = new GMaps({
		el: '#map',
		lat: Bakersfield[0],
		lng: Bakersfield[1],
		zoom: 7,
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
	var newstring = "<li>" + coord[2] + "</li>";
	newstring += '<li><div class="day"><span class="title">Day ' + num_days + ' </span></div></li>';
	document.getElementById("stops").innerHTML += newstring;
	renderRoute();
	num_days+=1;
	updateDays();
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

// Updates the path after reordering.
function updateDays() {
	var stops = document.getElementById("stops").children;
	var day = num_days;
	var loc = "San Diego";
	var time = 0;
	for (var i = stops.length - 1; i >= 0; i--) {
		if (stops[i].innerHTML.substring(0, 17) == '<div class="day">') {
			var offset = 0;
			while (offset <= i && stops[i-offset].innerHTML.substring(0, 17) == '<div class="day">')
			{
				offset +=1;
			}
			var prev_loc = "";
			if (offset > i) {
				prev_loc = "San Francisco";
			}
			else {
				prev_loc = stops[i-offset].innerHTML;
			}
			time += driving_time[prev_loc + "," + loc];
			loc = prev_loc;
			var daytext = '<div class="day"><span class="title">Day ' + day + ' </span><span class="delete" onclick="cancelDay(this)">X</span><span class="time"> ' + time + ' hrs </span></div>';
			stops[i].innerHTML=daytext;
			day -= 1;
			time = 0;
		} else {
			time += driving_time[stops[i].innerHTML + "," + loc];
			loc = stops[i].innerHTML;
		}
	}
}

// Adjusts map and sidebar to respond to a search.
function search(coord, value) {
	document.getElementById("searchResults").innerHTML = "";
	document.getElementById("keyword").value = "";
	map.removeMarkers();
	addRouteMarkers();
	map.addLayer('places', {
		location: new google.maps.LatLng(coord[0], coord[1]),
		radius: 10000,
		keyword: value,
		search: function (results, status) {
			if (status == google.maps.places.PlacesServiceStatus.OK) {
				for (var i = 0; i < 10; i++) {
					var place = results[i];
					var stars = "&#9733;&#9733;&#9734;&#9734;&#9734;";
					if ((place.name == "Spindrift Inn") || (place.name == "SeaVenture Hotel") || (place.name == "Alpine Inn")) {
						stars = "&#9733;&#9733;&#9733;&#9733;&#9733;";
					}
					map.addMarker({
						lat: place.geometry.location.lat(),
						lng: place.geometry.location.lng(),
						title: place.name,
						infoWindow: {
							content: '<p>' + place.name + "  " + stars + '</p>'
						}
					});
					var li = document.createElement("li");
					var add = document.createElement("button");
					add.setAttribute('onclick', 'addFromSearch()');
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

function addFromSearch() {
	addPoint(pointsToAdd.shift());
	$( "#sidebar" ).tabs( "option", "active", 0 );
	map.removeMarkers();
	addRouteMarkers();
	map.setCenter(Bakersfield[0], Bakersfield[1]);
	map.setZoom(7);
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

function cancelDay(n){
	n.parentNode.parentNode.parentNode.removeChild(n.parentNode.parentNode);
	num_days-=1;
	updateDays()
}

function addDay(){
	num_days+=1;
	var newstring = '<li><div class="day"><span class="title">Day ' + num_days + ' </span></div></li>';
	document.getElementById("stops").innerHTML += newstring;
	updateDays();
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
			$( "#sidebar" ).tabs( "option", "active", 0 );
		}
		if (action == "search") {
			// I'm not sure how to get the coords for this event, so I hard-coded it.
			$( "#sidebar" ).tabs( "option", "active", 1 );
			searchPoint = pointsToSearch.shift();
			search(searchPoint, "");
		}
	});

	// Add drag-drop functionality to lists.
	$("#stops").dragsort({
		dragSelector: "li",
		dragBetween: false,
		dragEnd: function() {
			updateDays();
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
		document.getElementById("searchResults").innerHTML = "";
		map.removeMarkers();
		addRouteMarkers();
	});
});
