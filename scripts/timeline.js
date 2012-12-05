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
  $("#sidebar a:first").tab("show");
  refreshMap();

  // Update
  updateTimeline();
}

// Adds a stop from coord
function addStop(coord) {
  //var node = document.createElement("div");
  //node.id = "new";
  //node.appendChild(stopNode(coord));
  //document.getElementById("timeline").appendChild(node);
  document.getElementById("stops").appendChild(stopNode(coord))
}

// Creates a stop node
function stopNode(coord) {
  var node = document.createElement("li");
  node.id = coord[2];
  node.className = "stop";
  node.style.cursor = "pointer";

  var img = document.createElement("img");
  img.className = "marker";
  img.src = markers[path.length - 1];

  var text = document.createElement("span");
  text.id = "stop_name";
  text.className = "stop_name";
  text.innerHTML = coord[2];

  var del = document.createElement("img");
  del.className = "delete";
  del.onclick = function() {cancelStop(node)};
  del.src = "images/cancel.png";

  node.appendChild(text);
  node.appendChild(img);
  node.appendChild(del);

  return node;  
}

// Checks the box for a stop, then adds it to the timeline if there is one.
function checkForNewDay() {
  var dayBox = document.getElementById("addNew");
  if (dayBox.innerHTML != "") {
    addDay();
    var stop = dayBox.children[0];
    document.getElementById("addNew").innerHTML = "";
    document.getElementById("stops").appendChild(stop);
  }
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
  del.setAttribute("onclick", "cancelDay(this)");
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
function updateTimeline() {
  var stops = document.getElementById("stops").children;
  var stop = path.length - 1;
  var day = num_days;
  var loc = endLocation;
  var dist = 0;
  var time = 0;
  var total_dist= 0;
  var total_time = 0;
  for (var i = stops.length - 1; i >= 0; i--) {
    if (stops[i].children[0].className == "day") {
      // Process Day

      // Get next (above) stop
      prev_loc = startLocation;
      if (stop >= 0) {
        prev_loc = path[stop];
      }

      // Calculate distance and time
      var dt = calcDistanceTime(get_pos(prev_loc), get_pos(loc))
      dist += dt[0];
      time += dt[1];
      loc = prev_loc;

      // Update Day
      // This was too slow
      //document.getElementById("stops").replaceChild(dayNode(day, dist, time), stops[i]);
      var node = document.getElementById("stops").children[i];
      node.innerHTML = dayNode(day, dist, time).innerHTML;
      node.id = "day " + day.toString();
      day -= 1;

      // Book keeping
      total_dist += dist;
      total_time += time;
      dist = 0;
      time = 0;
    } else {
      // Process stop
      stops[i].children[1].src = markers[stop];

      // Calculate distance and time
      var dt = calcDistanceTime(get_pos(path[stop]), get_pos(loc))

      // Book keeping
      dist += dt[0];
      time += dt[1];
      loc = path[stop];
      stop-=1;
    }
  }
  total_dist += dist;
  total_time += time;

  // Update Total
  var distDiv = document.getElementById("total_dist");
  var timeDiv = document.getElementById("total_time");
  distDiv.innerHTML = "Total Driving Distance: " + total_dist + ' mi';
  timeDiv.innerHTML = "Total Driving Time: " + total_time + ' hrs';
}

// Gets lat and long as a string from a coord
function get_pos(coord) {
  return coord[0].toString() + ", " + coord[1].toString();
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
  delete directionsService;
  return dist_time;
}

function deleteNode(node) {
  var li = node.parentNode.parentNode;
  node.parentNode.parentNode.parentNode.removeChild(li)
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