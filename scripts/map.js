var Bakersfield = [35.424536,-120.325521,"Bakersfield"];
var SanFrancisco = [37.796763,-122.422234,"San Francisco"];
var SanDiego = [32.717977,-117.158993,"San Diego"];
var MBAcquarium = [36.618051,-121.902061,"Monterey Bay Aquarium"];
var PismoBeach = [35.086115,-120.622912,"Pismo Beach"];
var Disneyland = [33.809391,-117.918924,"Disneyland"];
var SpindriftInn = [36.615889,-121.899773, "Spindrift Inn"];
var SeaVentureHotel = [35.136581,-120.641004, "SeaVenture Hotel"];
var AlpineInn = [33.803578,-117.917597, "Alpine Inn"];
var path = [];
var num_days = 1;
var distanceAndTime = {};
var coords = {};
var markers = ['images/markerA.png', 'images/markerB.png', 'images/markerC.png', 'images/markerD.png', 'images/markerE.png', 'images/markerF.png', 'images/markerG.png', 'images/markerH.png', 'images/markerI.png']

distanceAndTime["San FranciscoSan Diego"] = [502, 8.5]
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
	map.setContextMenu({
		control: 'map',
		options: [
    {
      title: 'Search here',
      name: 'search_here',
      action: function(e) {
        search([e.latLng.lat(), e.latLng.lng()], "");
        $("#sidebar").tabs("option", "active", 1);
      }
    },
    {
			title: 'Center here',
			name: 'center_here',
			action: function(e) {
				this.setCenter(e.latLng.lat(), e.latLng.lng());
			}
		}]
	});
}

// Add another location to map.
function addPoint(coord) {
	map.addMarker({
		lat: coord[0],
		lng: coord[1],
    icon: markers[path.length],
    infoWindow: {
  		content: "<p>" + coord[2] + "</p><p><input type='button' onclick='search([" + coord[0] + "," + coord[1] + "], \"\");' value='Search Nearby'></p>" + 
  			"<span id='marker' class='delete' onclick='cancelStopMarker(\"" + coord[2] + "\")'><img src='images/cancel.png' alt='cancel' /></span>"
		}
	});
	path.push(coord);
	var newstring = "<li id='" + coord[2] + "'class='stop' style='cursor: pointer'><span id='stop_name'>" + coord[2] + "</span><img class ='marker' src='" + markers[path.length - 1] + "'/><span class='delete' onclick='cancelStop(this)''><img src='images/cancel.png' alt='cancel' /></span></li>";
	newstring += '<li style="cursor: pointer"><div class="day" id="day' + (num_days + 1) + '" ><span class="title">Day ' + (num_days + 1) + ' </span></div></li>';
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
// Works from the bottom to the top
// Very hackish :(
function updateDays() {
	var stops = document.getElementById("stops").children;
	var stop = path.length;
	var day = num_days;
	var loc = "San Diego";
	var dist = 0;
	var time = 0;
	for (var i = stops.length - 1; i >= 0; i--) {
		if (stops[i].innerHTML.substring(0, 16) == '<div class="day"') {
			var offset = 1;
			while (offset <= i && stops[i-offset].innerHTML.substring(0, 16) == '<div class="day"')
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
			var daytext = '<div class="day" id="day' + day + '" ><span class="title">Day ' + day + ' </span><span class="delete" onclick="cancelDay(this)"><img src="images/cancel.png" alt="cancel" /></span><span class="details"> ' + time + ' hrs, ' + dist + ' mi </span></div>';
			if (day == 1) {
        daytext = '<div class="day" id="day1" ><span class="title">Day 1 </span><span class="details"> ' + time + ' hrs, ' + dist + ' mi </span></div>';
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

function calcDistanceTime(loc1, loc2) {
  var start = loc1.toString();
  var end = loc2.toString();
  var dist_time = [0, 0]
  if (start == end) {
    return dist_time;
  }
  var done = false;
  if ((start + end) in distanceAndTime) {
  	return distanceAndTime[start + end];
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
      distanceAndTime[start + end] = dist_time;
      distanceAndTime[end + start] = dist_time;
      done = true;
    } else {
    }
  });
  return dist_time;
}

// Adjusts map and sidebar to respond to a search.
function search(coord, value) {
	$("#sidebar").tabs("option", "active", 1);
	document.getElementById("searchResults").innerHTML = "";
	document.getElementById("keyword").value = "";
	map.removeMarkers();
	addRouteMarkers();
	map.addLayer('places', {
		location: new google.maps.LatLng(coord[0], coord[1]),
		radius: 5000,
		keyword: value,
		search: function (results, status) {
			if (status == google.maps.places.PlacesServiceStatus.OK) {
				for (var i = 0; i < 10; i++) {
					var place = results[i];
					var stars = random_stars(3, 5);
					if ((place.name == "Spindrift Inn") || (place.name == "SeaVenture Hotel") || (place.name == "Alpine Inn")) {
						stars = random_stars(5, 5);
					}
					map.addMarker({
						lat: place.geometry.location.lat(),
						lng: place.geometry.location.lng(),
						title: place.name,
						infoWindow: {
							content: '<p>' + place.name + "  " + stars + "</p><p>Phone Number: " + random_phone() + "</p><input type='button' value='Add' onclick='addPoint([" + place.geometry.location.lat() + ", " + place.geometry.location.lng() + ", \"" + place.name + "\"]);'>"
						}
					})
          var loc = [place.geometry.location.lat(), place.geometry.location.lng(), place.name]
					var li = document.createElement("li");
					var add = document.createElement("button");
					add.setAttribute('onclick', 'addPoint([' + loc[0] + ',' + loc[1] + ',"' + loc[2] + '"])');
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
      content: "<p>" + path[i][2] + "</p><p><input onclick='search([" + path[i][0] + "," + path[i][1] + "], \"\")'" + " type='button' value='Search Nearby'></p>" + 
        "<span id='marker' class='delete' onclick='cancelStopMarker(\"" + path[i][2] + "\")'><img src='images/cancel.png' alt='cancel' /></span>"
      }
		});
	}
}

// Remove a day from the Timeline.
// Since nested in day, has to go up to the list to remove from the ul.
function cancelDay(n){
	n.parentNode.parentNode.parentNode.removeChild(n.parentNode.parentNode);
	num_days-=1;
	updateDays()
}

// Remove a stop from the Timeline.
// Since nested in stop, has to go up to the list to remove from the ul.
function cancelStop(n){
  n.parentNode.parentNode.removeChild(n.parentNode);
  updatePath();
  updateDays()
  map.removeMarkers();  
  addRouteMarkers();  
  renderRoute();
}

function cancelStopMarker(stop){
  var li = document.getElementById(stop);
  li.parentNode.removeChild(li);
  updatePath();
  updateDays()
  map.removeMarkers();  
  addRouteMarkers();  
  renderRoute();
}

// Adds a day to the end
function addDay(){
	num_days+=1;
	var newstring = '<li><div class="day" id="day' + num_days + '"><span class="title">Day ' + num_days + ' </span></div></li>';
	document.getElementById("stops").innerHTML += newstring;
	updateDays();
}


$(document).ready(function(){

	createMap();

  // Refresh Timeline to get the time and distance info for the days
	setTimeout(refresh,1000);

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
    searchWord();
	});

  $("#timeline").click(function() {
    map.removeMarkers();
    addRouteMarkers();
    map.setCenter(Bakersfield[0], Bakersfield[1]);
    map.setZoom(7);
  });
});

// Updates the days in timeline
function refresh() {
  updateDays();
  setTimeout(refresh,1000);
}

// DEBUGGING: Returns a list of functions for the object
function dir(object) {
    stuff = [];
    for (s in object) {
        stuff.push(s);
    }
    stuff.sort();
    return stuff;
}

// Random number of stars between min and max
function random_stars(min, max) {
  var num = Math.floor(Math.random() * (max-min)) + min;
  var stars = "";
  for (var i = 0; i < num; i++) {
    stars += "&#9733";
  }
  for (var i = num; i < 5; i++) {
    stars += "&#9734";
  }
  return stars;
}



// Generate a random phone number
function random_phone() {
  var num = "";
  for (var i = 0; i < 3; i++) {
    num += Math.floor(Math.random() * 9).toString();
  }
  num += '-'
  for (var i = 0; i < 4; i++) {
    num += Math.floor(Math.random() * 9).toString();
  }
  return num
}

function searchWord() {
  GMaps.geocode({
  address: $('#keyword').val(),
  callback: function(results, status) {
    if (status == 'OK') {
      var latlng = results[0].geometry.location;
      search([latlng.lat(), latlng.lng()], "");
    }
  }
});
}
/*
// Random review based on rating
function random_review(rating, type){
   var review = "";
   if(type == "attraction" && rating == 3){
      review += “Very enjoyable, but maybe not memorable. Would still recommend it, though, if you 
      have time.”;
   }
   if(type == "attraction" && rating == 4){
      review += “Such a cool place! Everyone had a good time. Highly recommended.”;
   }
   if(type == "attraction" && rating == 5){
      review += “We had an amazing time! The kids absolutely loved it, and my wife and I had so 
      much fun!”;
   }
   if(type == "hotel" && rating == 3){
      review += “No bells and whistles, but it was clean and reliable, and that was all we needed.”;
   }
   if(type == "hotel" && rating == 4){
      review += “The place was clean and the owner was very kind. Centrally located.”;
   }
   if(type == "hotel" && rating == 5){
      review += “What an amazing hotel.  Could not have asked for better accommodations or 
      service.”;
   }
   return review;
}
*/