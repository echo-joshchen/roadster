/**

This file has searching functions.

**/

var searchMarkers = ['images/marker1.png', 'images/marker2.png', 'images/marker3.png', 'images/marker4.png', 'images/marker5.png',
                     'images/marker6.png', 'images/marker7.png', 'images/marker8.png', 'images/marker9.png', 'images/marker10.png',
                     'images/marker11.png', 'images/marker12.png', 'images/marker13.png', 'images/marker14.png', 'images/marker15.png',
                     'images/marker16.png', 'images/marker17.png', 'images/marker18.png', 'images/marker19.png', 'images/marker20.png']

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
  $("#sidebar a:last").tab("show");
  document.getElementById("searchResults").innerHTML = "";
  map.removeMarkers();
  addRouteMarkers();
  map.addLayer('places', {
    location: new google.maps.LatLng(coord[0], coord[1]),
    radius: 5000,
    keyword: value,
    search: function (results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        var max = 10;
        if (results.length < max) {
          max = results.length;
        }
        for (var i = 0; i < max; i++) {
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
            icon: searchMarkers[i],
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
          var image = document.createElement("img");
          image.setAttribute('src', searchMarkers[i]);
          li.appendChild(image);
          document.getElementById("searchResults").appendChild(li);
        }
      }
    }
  });
  map.setCenter(coord[0], coord[1]);
  map.setZoom(13);
}