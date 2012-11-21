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
var timeAndDistance = {};
var coords = {};
var markers = ['images/markerA.png', 'images/markerB.png', 'images/markerC.png', 'images/markerA.png', 'images/markerA.png', 'images/markerA.png', 'images/markerA.png', 'images/markerA.png', 'images/markerA.png']

var geocoder = new google.maps.Geocoder();
var directionsService = new google.maps.DirectionsService();

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
    icon: "images/start.png"
	});
	map.addMarker({
		lat: SanDiego[0],
		lng: SanDiego[1],
		title: "End Location: San Diego",
    icon: "images/end.png"
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
        icon: markers[path.length],
        infoWindow: {
				content: "<p>" + coord[2] + "</p>" + "<span class='delete' onclick='cancelStop(this)''><img src='images/cancel.png' alt='cancel' /></span>"
		}

	});

	path.push(coord);
	var newstring = "<li class='stop'><span id='stop_name'>" + coord[2] + "</span><img class ='marker' src='" + markers[path.length - 1] + "'/><span class='delete' onclick='cancelStopMap(this)''><img src='images/cancel.png' alt='cancel' /></li>";
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
			if (stops[i].children[0].innerHTML == path[j][2]) {
				newPath.push(path[j]);
			}
		}
	}
	path = newPath;
}

// Updates the path after reordering.
function updateDays() {
	var stops = document.getElementById("stops").children;
	var stop = path.length;
	var day = num_days;
	var loc = "San Diego";
	var dist = 0;
	var time = 0;
	for (var i = stops.length - 1; i >= 0; i--) {
		if (stops[i].innerHTML.substring(0, 17) == '<div class="day">') {
			var offset = 1;
			while (offset <= i && stops[i-offset].innerHTML.substring(0, 17) == '<div class="day">')
			{
				offset +=1;
			}
			var prev_loc = "";
			if (offset > i) {
				prev_loc = "San Francisco";
			}
			else {
				prev_loc = stops[i-offset].children[0].innerHTML;
			}
      var dt = calcDistanceTime(prev_loc, loc)
			dist += dt[0];
      time += dt[1];
      loc = prev_loc;
			var daytext = '<div class="day"><span class="title">Day ' + day + ' </span><span class="delete" onclick="cancelDay(this)"><img src="images/cancel.png" alt="cancel" /></span><span class="details"> ' + time + ' hrs, ' + dist + ' mi </span></div>';
			if (day == 1) {
        daytext = '<div class="day"><span class="title">Day ' + day + ' </span><span class="details"> ' + time + ' hrs, ' + dist + ' mi </span></div>';
      }
      stops[i].innerHTML=daytext;
			day -= 1;
			time = 0;
      dist = 0;
		} else {
      stops[i].children[1].src = markers[stop-1];
      stop-=1
      var dt = calcDistanceTime(stops[i].children[0].innerHTML, loc)
      dist += dt[0];
      time += dt[1];
			loc = stops[i].children[0].innerHTML;
		}
	}
}

function sleep(ms)
{
  var dt = new Date();
  dt.setTime(dt.getTime() + ms);
  while (new Date().getTime() < dt.getTime());
}

function getCoord(location) {
  loc = location.toString();
  if (loc in coords) {
    return coords[loc];
  }
  geocoder.geocode( {'address': loc}, function(result, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      coord = [result[0].geometry.location.lat(), result[0].geometry.location.lng()];
      coords[loc] = coord;
      return coord;
    }
  });
}

function calcDistanceTime(loc1, loc2) {
  var start = loc1.toString();
  var end = loc2.toString();
  var dist_time = [0, 0]
  if (start == end) {
    return dist_time;
  }
  var done = false;
  if ((start + end) in timeAndDistance) {
  	return timeAndDistance[start + end];
  }
  var request = {
    origin:start,
    destination:end,
    travelMode: google.maps.TravelMode.DRIVING
  };
  var directionsService = new google.maps.DirectionsService();
  directionsService.route(request, function(result, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      // Meters to miles
      dist_time = [Math.round(result.routes[0].legs[0].distance.value * 0.000621371), Math.round(result.routes[0].legs[0].duration.value / 3600)];
      timeAndDistance[start + end] = dist_time;
      timeAndDistance[end + start] = dist_time;
      done = true;
    } else {
    }
  });
  return dist_time;
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
    icon: "images/start.png"
	});
	map.addMarker({
		lat: SanDiego[0],
		lng: SanDiego[1],
		title: "End Location: San Diego",
    icon: "images/end.png"
	});
	for (var i = 0; i < path.length; i++) {
		map.addMarker({
			lat: path[i][0],
			lng: path[i][1],
			title: path[i][2],
			icon: markers[i],
			infoWindow: {
				content: "<p>" + path[i][2] + "</p>"
			}
		});
	}
}

function cancelDay(n){
	n.parentNode.parentNode.parentNode.removeChild(n.parentNode.parentNode);
	num_days-=1;
	updateDays()
}

function cancelStop(n){
  n.parentNode.parentNode.removeChild(n.parentNode);
  updatePath();
  updateDays()
  map.removeMarkers();  
  addRouteMarkers();  
  renderRoute();
}

function cancelStopMap(n){
 // pls josh... i have no idea what this is....
}

function addDay(){
	num_days+=1;
	var newstring = '<li><div class="day"><span class="title">Day ' + num_days + ' </span></div></li>';
	document.getElementById("stops").innerHTML += newstring;
	updateDays();
}

function refresh() {
  updateDays();
}

function dir(object) {
    stuff = [];
    for (s in object) {
        stuff.push(s);
    }
    stuff.sort();
    return stuff;
}

$(document).ready(function(){

	createMap();

  setInterval(refresh,1000);

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
		if (action == "center") {
			centerCoord = centerCoords.shift();
			map.setCenter(centerCoord[0], centerCoord[1]);
		}
	});

	// Add drag-drop functionality to lists.
	$("#stops").dragsort({
		dragSelector: "li",
		dragBetween: false,
		dragEnd: function() {
      updatePath();
			updateDays();
      map.removeMarkers();
      addRouteMarkers();
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

  $("#timeline").click(function() {
    map.removeMarkers();
    addRouteMarkers();
    map.setCenter(Bakersfield[0], Bakersfield[1]);
    map.setZoom(7);
  });
});
