/**

This file has Google Maps API functions.

**/

// Creates the initial map from SF to SD.
function createMap() {
  map = new GMaps({
    el: '#map',
    lat: Bakersfield[0],
    lng: Bakersfield[1],
    zoom: 7,
  });

  // start
  start = initialParams['start_location'];
  var startLocation;
  GMaps.geocode({
    address: start,
    callback: function(results, status) {
      if (status == 'OK') {
        var latlng = results[0].geometry.location;
        startLocation = [latlng.lat(), latlng.lng(), start];
        addStart(startLocation);
      }
    }
  });

  //end
  end = initialParams['end_location'];
  if (end != '') {}
    GMaps.geocode({
      address: end,
      callback: function(results, status) {
        if (status == 'OK') {
          var latlng = results[0].geometry.location;
          var endLocation = [latlng.lat(), latlng.lng(), start];
          addEnd(endLocation);
        }
      }
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

  return map;
}

function addStart(startLocation) {
  map.addMarker({
    lat: startLocation[0],
    lng: startLocation[1],
    title: "Start Location: " + startLocation[2],
    icon: "images/start.png"
  })
}

function addEnd(endLocation) {
  map.addMarker({
    lat: endLocation[0],
    lng: endLocation[1],
    title: "Start Location: " + endLocation[2],
    icon: "images/end.png"
  })
}

// Renders the current route
function renderRoute() {
  map.cleanRoute();
  var origin = SanFrancisco;

  // Loop to draw between each point
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

  // Draw final stretch to San Diego
  map.drawRoute({
    origin: origin.slice(0, 2),
    destination: SanDiego.slice(0, 2),
    travelMode: 'driving',
    strokeColor: '#CC0000',
    strokeOpacity: 0.6,
    strokeWeight: 6
  });
}

// Adds back the markers for the route, after the search markers are deleted.
// I didn't find a way to delete certain markers, so I'm resorting to this method.
function addRouteMarkers() {

  // Add San Francisco
  map.addMarker({
    lat: SanFrancisco[0],
    lng: SanFrancisco[1],
    title: "Start Location: San Francisco",
    icon: "images/start.png"
  });

  // Add San Diego
  map.addMarker({
    lat: SanDiego[0],
    lng: SanDiego[1],
    title: "End Location: San Diego",
    icon: "images/end.png"
  });

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
}
