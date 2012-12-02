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
  addStop(coord);
  
  // Adding the list element for the day
  addDay();

  // Update
  renderRoute();
  updateTimeline();
}

// Adds a stop from coord
function addStop(coord) {
  document.getElementById("stops").appendChild(stopNode(coord))
}

// Creates a stop node
function stopNode(coord) {
  var node = document.createElement("li");
  node.id = coord[2];
  node.className = "stop";
  node.style.cursor = "pointer";
  var text = document.createElement("span");
  text.id = "stop_name";
  text.innerHTML = coord[2];
  var img = document.createElement("img");
  img.className = "marker";
  img.src = markers[path.length - 1];
  var del = document.createElement("img");
  del.className = "delete";
  del.onclick = function() {cancelStop(node)};
  del.src = "images/cancel.png";
  node.appendChild(text);
  node.appendChild(img);
  node.appendChild(del);

  return node;  
}

// Adds a day to the end of the list
function addDay() {
  num_days+=1;
  node = dayNode(num_days, 0, 0);
  document.getElementById("stops").appendChild(node);
  updateTimeline();
}

// Creates a day node
function dayNode(daynum, dist, time) {
  var node = document.createElement("li");
  node.id = "day" + daynum.toString();

  var day = document.createElement("div");
  day.className = "day";

  var title = document.createElement("span");
  title.className = "title";
  title.innerHTML = "Day " + daynum.toString();

  var dist_time = document.createElement("span");
  dist_time.className = "details";
  dist_time.innerHTML = dist.toString() + " mi, " + time.toString() + " hrs"

  var del = document.createElement("img");
  del.className = "delete";
  del.onclick = function() {cancelDay(node)};
  del.src = "images/cancel.png";
  day.appendChild(title);
  day.appendChild(dist_time);
  if (daynum > 1) {
    day.appendChild(del);
  }
  node.appendChild(day);
  return node
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
function updateTimeline() {
  var stops = document.getElementById("stops").children;
  var stop = path.length;
  var day = num_days;
  var loc = "San Diego";
  var dist = 0;
  var time = 0;
  var total_dist= 0;
  var total_time = 0;
  for (var i = stops.length - 1; i >= 0; i--) {
    if (stops[i].children[0].className == "day") {
      var offset = 1;

      // Skip over days
      while (offset <= i && stops[i-offset].children[0].className == "day")
      {
        offset +=1;
      }

      // Get previous location
      var prev_loc = "San Francisco";
      if (offset <= i) {
        prev_loc = stops[i-offset].id;
      }

      var dt = calcDistanceTime(prev_loc, loc)
      dist += dt[0];
      time += dt[1];
      loc = prev_loc;

      // Update Day
      // This was too slow
      //document.getElementById("stops").replaceChild(dayNode(day, dist, time), stops[i]);
      var node = document.getElementById("stops").children[i];
      node.innerHTML = dayNode(day, dist, time).innerHTML;
      node.id = "day " + day.toString();
      bind_click(node)
      day -= 1;

      // Book keeping
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

function bind_click(node) {
  node.onclick = function() {cancelDay(node)};
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

function deleteNode(node) {
  node.parentNode.removeChild(node)
}

// Remove a day from the Timeline.
// Since nested in day, has to go up to the list to remove from the ul.
function cancelDay(n){
  deleteNode(n);
  num_days-=1;
  updateTimeline()
}

// Remove a stop from the Timeline.
// Since nested in stop, has to go up to the list to remove from the ul.
function cancelStop(n){
  deleteNode(n)
  updatePath();
  updateTimeline()
  map.removeMarkers();  
  addRouteMarkers();  
  renderRoute();
}

function cancelStopMarker(name) {
  deleteNode(document.getElementById(name));
}