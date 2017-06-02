var currentUnit;
var geocoder;

function retrieveData(position) {
  var key = "8179bb627b93a44a50320f0709cb84cc";
  var googlekey = "AIzaSyAR3U4eArH2OPqUv7udHHfY8wUz1zeaQ38";
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;
  console.log(latitude);
  console.log(longitude);
  console.log('https://api.darksky.net/forecast/' + key + '/' + latitude + ',' + longitude);
  console.log('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&key=' + googlekey);
  $.ajax({
    url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&key=' + googlekey,
    dataType: 'JSON',
    success: function (data) {
      console.log("success google data");
      address = data.results[1].formatted_address;
      console.log(address);
      $("#location").text(address);
    },
    error: function() {
      console.log("error google data");
    }
  });
  $.ajax({
    url: 'https://api.darksky.net/forecast/' + key + '/' + latitude + ',' + longitude,
    dataType: 'JSONP',
    success: function (data) {
      console.log("success retrieving data");
      console.log(data.currently.temperature);
      console.log(data.timezone);
      console.log(data.currently.icon.toUpperCase());
      console.log(data.currently.time);
      
      var temperature = data.currently.temperature;
      if(currentUnit === "Celsius") {
        $("#unit").text(" \xB0C");
        temperature = (temperature - 32) * 5/9;
      }
      temperature = temperature.toFixed(0);
      var summary = data.minutely.summary;
      console.log(summary);
      $("#summary").text(summary);
      var icon = data.currently.icon.toUpperCase();
      var time = data.currently.time;
      var date = new Date(time*1000);
      console.log(date.getMonth() + 1 + ' ' + date.getDate() + ' ' + date.getFullYear());
      
      $("#temperature").html(temperature);
      $("#date").html(date.getMonth()+1 + '/' + date.getDate() + '/' + date.getFullYear() + ' @ ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds());
      
      var skycons = new Skycons({"color": "white"});
      console.log(icon);
      skycons.add(document.getElementById("icon"), icon);
      skycons.play();
    },
    error: function () {
      console.log("failure retrieving data");
    },
    cache: false
  });
}

function showPosition(position) {
  var location = "Latitude: " + position.coords.latitude +
                 "\nLongitude: " + position.coords.longitude;
  console.log(location);
}

function toggleUnit() {
  if(currentUnit === "Fahrenheit") {
    currentUnit = "Celsius";
    fTemp = $("#temperature").text();
    console.log(fTemp);
    cTemp = (fTemp - 32) * 5/9;
    $("#temperature").text(cTemp.toFixed(0));
    $("#unit").text(" \xB0C");
    $("#unitbutton").text("to Fahrenheit");
  } else {
    currentUnit = "Fahrenheit";
    cTemp = $("#temperature").text();
    console.log(fTemp);
    fTemp = (cTemp * 9/5) + 32;
    $("#temperature").text(fTemp.toFixed(0));
    $("#unit").text(" \xB0F");
    $("#unitbutton").text("to Celsius");
  }
}

$(document).ready(function () {
  if(navigator.geolocation) {
    console.log("supported");
    currentUnit = "Fahrenheit";
    navigator.geolocation.getCurrentPosition(retrieveData);
  } else {
    console.log("not supported");
  }
});