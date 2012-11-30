/**

This file has searching functions.

**/

// Submits a search
// Gets the name from the "search_name" field
// Gets the location from the "search_location" field
//   if search_location is empty, uses center of map
function submit_search() {
  var search_name = $('#search_name').val()
  var search_location = $('#search_location').val();
  if (search_location == "") {
    search_location = map.getCenter();
  }
  GMaps.geocode({
  address: search_location,
  callback: function(results, status) {
      if (status == 'OK') {
        var latlng = results[0].geometry.location;
        search([latlng.lat(), latlng.lng()], search_name);
      }
    }
  });
}

// Adjusts map and sidebar to respond to a search.
// Zooms in on the coord and searches for places relating to the value (name)
function search(coord, value) {
  $("#sidebar").tabs("option", "active", 1);
  document.getElementById("searchResults").innerHTML = "";
  document.getElementById("search_name").value = "";
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

          var marker_content = '<p>' + place.name + "  " + stars + "</p><p>Phone Number: " + random_phone() + "</p>";
          // Review goes here:
          marker_content += "<p>" + "Review" + "</p>"
          marker_content += "<input type='button' value='Add' onclick='addPoint([" + place.geometry.location.lat() + ", " + place.geometry.location.lng() + ", \"" + place.name + "\"]);'>"
          map.addMarker({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            title: place.name,
            infoWindow: {
              content: marker_content
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