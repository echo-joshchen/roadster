/**

This file has utility functions.

**/


// Updates the days in timeline, calls itself every second
function refresh() {
  updateTimeline();
  setTimeout(refresh,1000);
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

// DEBUGGING: Returns a list of functions for the object
function dir(object) {
    stuff = [];
    for (s in object) {
        stuff.push(s);
    }
    stuff.sort();
    return stuff;
}

function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}