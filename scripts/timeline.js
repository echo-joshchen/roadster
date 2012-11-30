/**

This file has timeline functions.

**/

// Add another stop
function addPoint(coord) {
  // Adding marker
  map.addMarker({
    lat: coord[0],
    lng: coord[1],
    icon: markers[path.length],
    infoWindow: {
      content: "<p>" + coord[2] + "</p><p><input type='button' onclick='search([" + coord[0] + "," + coord[1] + "], \"\");' value='Search Nearby'></p>" + 
        "<span id='marker' class='delete' onclick='cancelStopMarker(\"" + coord[2] + "\")'><img src='images/cancel.png' alt='cancel' /></span>"
    }
  });

  // Adding to path
  path.push(coord);

  // Adding list element for the stop
  var newstring = "<li id='" + coord[2] + "'class='stop' style='cursor: pointer'><span id='stop_name'>" + coord[2] + "</span><img class ='marker' src='" + markers[path.length - 1] + "'/><span class='delete' onclick='cancelStop(this)''><img src='images/cancel.png' alt='cancel' /></span></li>";
  document.getElementById("stops").innerHTML += newstring;
  
  // Adding the list element for the day
  addDay();

  // Update
  renderRoute();
  updateDays();
}

// Adds a day to the end of the list
function addDay(){
  num_days+=1;
  var newstring = '<li><div class="day" id="day' + num_days + '"><span class="title">Day ' + num_days + ' </span></div></li>';
  document.getElementById("stops").innerHTML += newstring;
  updateDays();
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
// Should be refactored
function updateDays() {
  var stops = document.getElementById("stops").children;
  var stop = path.length;
  var day = num_days;
  var loc = "San Diego";
  var dist = 0;
  var time = 0;
  var total_dist= 0;
  var total_time = 0;
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
      total_dist += dist;
      total_time += time;
      dist = 0;
      time = 0;
    } else {
      stops[i].children[1].src = markers[stop-1];
      stop-=1
      var dt = calcDistanceTime(stops[i].children[0].innerHTML, loc)
      dist += dt[0];
      time += dt[1];
      loc = stops[i].children[0].innerHTML;
    }
  }
  total_dist += dist;
  total_time += time;
  var stops = document.getElementById("total_td");
  stops.innerHTML = "Trip Time and Distance: " + total_time + ' hrs, ' + total_dist + ' mi'
}

// Calculates the distance between the two locations
// Memoized to prevent long lookups
function calcDistanceTime(loc1, loc2) {
  var start = loc1.toString();
  var end = loc2.toString();
  var dist_time = [0, 0]

  // Check for same loc1 and loc2
  if (start == end) {
    return dist_time;
  }

  // Check in hash
  if ((start + end) in distanceAndTime) {
    return distanceAndTime[start + end];
  }

  // Request
  var request = {
    origin:start,
    destination:end,
    travelMode: google.maps.TravelMode.DRIVING,
    region: 'us'
  };

  // Google Maps request
  var directionsService = new google.maps.DirectionsService();
  directionsService.route(request, function(result, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      // Meters to miles
      dist_time = [Math.round(result.routes[0].legs[0].distance.value * 0.000621371), Math.round(result.routes[0].legs[0].duration.value / 3600)];
      distanceAndTime[start + end] = dist_time;
      distanceAndTime[end + start] = dist_time;
    }
  });
  return dist_time;
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