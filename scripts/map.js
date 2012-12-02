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
var markers = ['images/markerA.png', 'images/markerB.png', 'images/markerC.png', 'images/markerD.png', 'images/markerE.png', 'images/markerF.png', 'images/markerG.png', 'images/markerH.png', 'images/markerI.png', 'images/markerJ.png', 'images/markerK.png', 'images/markerL.png', 'images/markerM.png', 'images/markerN.png', 'images/markerO.png', 'images/markerP.png', 'images/markerQ.png', 'images/markerR.png', 'images/markerS.png', 'images/markerT.png', 'images/markerU.png', 'images/markerV.png', 'images/markerW.png', 'images/markerX.png', 'images/markerY.png', 'images/markerZ.png']


// Initialize San Francisco to San Deigo
distanceAndTime["San FranciscoSan Diego"] = [502, 8.5]

$(document).ready(function(){

  createMap();

  // Refresh Timeline to get the time and distance info for the days
  setTimeout(refresh,1000);

  var search_location_input = document.getElementById('search_location');
  options = {
    types: ['(cities)'],
    componentRestrictions: {country: 'us'}
  };
  autocomplete = new google.maps.places.Autocomplete(search_location_input, options);

  // For testing
  addPoint(MBAcquarium);

  // Add drag-drop functionality to lists.
  $("#stops").dragsort({
    dragSelector: "li",
    dragBetween: false,
    dragEnd: function() {
      updatePath();
      updateTimeline();
      map.removeMarkers();
      addRouteMarkers();
      renderRoute();
    },
    placeHolderTemplate: ""
  });

  // Adds search button event handler.
  $("#submit").click(function() {
    submit_search();
  });

  $("#timeline").click(function() {
    map.removeMarkers();
    addRouteMarkers();
    map.setCenter(Bakersfield[0], Bakersfield[1]);
    map.setZoom(7);
  });
});

/*
// Random review based on rating
/*function random_review(rating, type){
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
<<<<<<< HEAD
}
*/
