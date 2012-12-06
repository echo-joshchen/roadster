var Bakersfield = [35.424536,-120.325521,"Bakersfield"];
var SanFrancisco = [37.796763,-122.422234,"San Francisco"];
var SanDiego = [32.717977,-117.158993,"San Diego"];
var MBAcquarium = [36.618051,-121.902061,"Monterey Bay Aquarium"];
var path = [];
var num_days = 1;
var distanceAndTime = {};
var coords = {};
var initialParams = getUrlVars();
var startLocation = [];
var endLocation = [];
var markers = ['images/markerA.png', 'images/markerB.png', 'images/markerC.png', 'images/markerD.png', 'images/markerE.png', 
               'images/markerF.png', 'images/markerG.png', 'images/markerH.png', 'images/markerI.png', 'images/markerJ.png',
               'images/markerK.png', 'images/markerL.png', 'images/markerM.png', 'images/markerN.png', 'images/markerO.png',
               'images/markerP.png', 'images/markerQ.png', 'images/markerR.png', 'images/markerS.png', 'images/markerT.png',
               'images/markerU.png', 'images/markerV.png', 'images/markerW.png', 'images/markerX.png', 'images/markerY.png', 'images/markerZ.png'];
var curr_stop = null;
var old_height = 800;

$(document).ready(function(){
  old_height = $(".itinerary").height();

  beforeCreateMap();

  // Refresh Timeline to get the time and distance info for the days
  setTimeout(refresh,1000);

  var search_location_input = document.getElementById('search_location');
  options = {
    types: ['(cities)'],
    componentRestrictions: {country: 'us'}
  };
  autocomplete = new google.maps.places.Autocomplete(search_location_input, options);

  // Add drag-drop functionality to lists.
  $("#stops, #addNew, #newStopList").dragsort({
    dragSelector: "li",
    dragBetween: true,
    dragEnd: function() {
      replaceCurrStop();
      checkForNewDay();
      updatePath();
      updateTimeline();
      refreshMap();
    },
    placeHolderTemplate: "<li class='placeholder'></li>"
  });

  $("#newStop").hide();

  // Adds search button event handler.
  $("#submit").click(function() {
    submit_search();
  });

  $(".active").click(function() {
    refreshMap();
  });

  $("#hideStopList").click(function() {
    document.getElementById("newStopList").innerHTML = "";
    $("#newStop").hide();
    $(".itinerary").height(old_height);
  });

  var start = initialParams['start_date'];
  var end = initialParams['end_date'];
  if (start != "") {
    document.getElementById("trip").innerHTML = start;
    if (end != "") {
      document.getElementById("trip").innerHTML += " to " + end;
    }
  }

  document.getElementById("addNew").innerHTML = ""
});
