/**

This file has Google Maps API functions.

**/

function beforeCreateMap() {
  start = initialParams['start_location'];
  end = initialParams['end_location'];
  if (end != '') {
    GMaps.geocode({
      address: start,
      callback: function(results, status) {
        if (status == 'OK') {
          var latlng = results[0].geometry.location;
          startLocation = [latlng.lat(), latlng.lng(), start];
        }
      }
    });
    GMaps.geocode({
      address: end,
      callback: function(results, status) {
        if (status == 'OK') {
          var latlng = results[0].geometry.location;
          endLocation = [latlng.lat(), latlng.lng(), end];
          createMap();
        }
      }
    });
  } else {
    GMaps.geocode({
      address: start,
      callback: function(results, status) {
        if (status == 'OK') {
          var latlng = results[0].geometry.location;
          startLocation = [latlng.lat(), latlng.lng(), start];
          createMap();
        }
      }
    });
  }
}

// Creates the initial map from SF to SD.
function createMap() {
  
  map = new GMaps({
    el: '#map',
    lat: startLocation[0],
    lng: startLocation[1],
    zoom: 7,
  });

  // start
  map.addMarker({
    lat: startLocation[0],
    lng: startLocation[1],
    title: "Start Location: " + startLocation[2],
    icon: "images/start.png"
  });

  if (endLocation.length != 0) {

    map.setCenter((startLocation[0]+endLocation[0])/2, (startLocation[1]+endLocation[1])/2);

    map.addMarker({
      lat: endLocation[0],
      lng: endLocation[1],
      title: "End Location: " + endLocation[2],
      icon: "images/end.png"
    });

    map.drawRoute({
      origin: startLocation,
      destination: endLocation,
      travelMode: 'driving',
      strokeColor: '#CC0000',
      strokeOpacity: 0.6,
      strokeWeight: 6
    });
  }
  else {
    endLocation = startLocation;
  }

  map.setContextMenu({
    control: 'map',
    options: [
    {
      title: 'Search here',
      name: 'search_here',
      action: function(e) {
        search([e.latLng.lat(), e.latLng.lng()], "");
        $("#sidebar a:last").tab("show");
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


  document.getElementById("start").innerHTML = '<img src="images/start.png" />' + startLocation[2];
  document.getElementById("end").innerHTML = '<img src="images/end.png" />' + endLocation[2];

  if (startLocation != endLocation) {
    fitMap();
  }
  else {
    map.setZoom(9);
  }

  return map;
}

// Renders the current route
function renderRoute() {
  map.cleanRoute();
  renderStep(0);
}

function renderStep(i) {
  if (i == 0) {
    map.drawRoute({
      origin: startLocation.slice(0, 2),
      destination: path[i].slice(0, 2),
      travelMode: 'driving',
      strokeColor: '#CC0000',
      strokeOpacity: 0.6,
      strokeWeight: 6
    });
    setTimeout(function() {renderStep(i+1)}, 50);
    //renderStep(i+1);
  } else if (i == path.length) {
    map.drawRoute({
      origin: path[i-1].slice(0, 2),
      destination: endLocation.slice(0, 2),
      travelMode: 'driving',
      strokeColor: '#CC0000',
      strokeOpacity: 0.6,
      strokeWeight: 6
    });
  } else {
    map.drawRoute({
      origin: path[i-1].slice(0, 2),
      destination: path[i].slice(0, 2),
      travelMode: 'driving',
      strokeColor: '#CC0000',
      strokeOpacity: 0.6,
      strokeWeight: 6
    });
    setTimeout(function() {renderStep(i+1)}, 50);
    //renderStep(i+1);
  }
}

// Adds back the markers for the route, after the search markers are deleted.
// I didn't find a way to delete certain markers, so I'm resorting to this method.
function addRouteMarkers() {

  // Add start location
  map.addMarker({
    lat: startLocation[0],
    lng: startLocation[1],
    title: "Start Location: " + startLocation[2],
    icon: "images/start.png"
  });

  // Add end location
  if (endLocation != startLocation) {
    map.addMarker({
      lat: endLocation[0],
      lng: endLocation[1],
      title: "End Location: " + endLocation[2],
      icon: "images/end.png"
    });
  }

  // Add all path markers
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

  fitMap();
}

function fitMap() {
  var places = [new google.maps.LatLng(startLocation[0], startLocation[1]), new google.maps.LatLng (endLocation[0], endLocation[1])];
  for (var i = 0; i < path.length; i++) {
    places.push(new google.maps.LatLng(path[i][0], path[i][1]));
  }
  var bounds = new google.maps.LatLngBounds ();
  //  Go through each...
  for (var i = 0; i < places.length; i++) {
    //  And increase the bounds to take this point
    bounds.extend(places[i]);
  }
  //  Fit these bounds to the map
  map.fitBounds (bounds);

  delete bounds;
  for (var i = 0; i < places.length; i++) {
    delete places[i];
  }
  delete places;
}

function refreshMap() {
  fitMap();
  map.removeMarkers();
  addRouteMarkers();
  renderRoute();
}