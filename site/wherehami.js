function maidenhead(_latitude, _longitude)
{
	// http://en.wikipedia.org/wiki/Maidenhead_Locator_System
	// Hacks to avoid negative numbers...

	var longitude = _longitude;
	longitude += 180;
	longitude /= 2;

	var latitude = _latitude;
	latitude += 90;

	function goat(start, offset)
	{
		return String.fromCharCode(start.charCodeAt() + offset);
	}

	var long1 = goat('A', Math.floor(longitude / 10));
	var lat1 = goat('A', Math.floor(latitude / 10));

	var long2 = goat('0', Math.floor(longitude % 10));
	var lat2 = goat('0', Math.floor(latitude % 10));

	var long3 = goat('a', Math.floor((longitude % 1) * 24));
	var lat3 = goat('a', Math.floor((latitude % 1) * 24));

	return {
		maidenhead: long1 + lat1 + long2 + lat2 + long3 + lat3,
		maidenhead_coordinates: {latitude: latitude, longitude: longitude},
		coordinates: {latitude: _latitude, longitude: _longitude},
	};
}

function success(position)
{
	show_location(position.coords.latitude, position.coords.longitude);
}

function show_location(latitude, longitude)
{
	var MAP_ZOOM = 16;
	var location = maidenhead(latitude, longitude);

	$("#waiting").hide();
	$("#geocoder").hide();
	$("#success").show();
	$("#maidenhead").html(location.maidenhead);
	$("#coordinates").html(location.coordinates.latitude + ", " + location.coordinates.longitude);
	$("#maidenhead_coordinates").html(location.maidenhead_coordinates.latitude + ", " + location.maidenhead_coordinates.longitude);
	//$.get("stats", {maidenhead: location.maidenhead}); // TODO Sort privacy implications etc.

	var latlng = new google.maps.LatLng(latitude, longitude);

	var myOptions = {
		zoom: MAP_ZOOM,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
	};
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

	var marker = new google.maps.Marker({
		map: map,
		position: latlng,
		title: location.maidenhead,
	});
}

function failure(error)
{
	$("#waiting").hide();
	$("#failure").show();
	$("#error_message").html(error.message);
}
	
function show_geocoder()
{
	$("#waiting").hide();
	$("#failure").hide();
	$("#success").hide();
	$("#geocoder").show();
}

function geolocate()
{
	$("#waiting").show();

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(success, failure);
	} else {
		failure("Your browser does not support Geolocation"); //TODO Improve this failure message
	}
}

$(function() {

	$("#use_geolocation").click(geolocate);
	$(".show_geocoder").click(show_geocoder);

	var geocoder_search_input = document.getElementById("geocoder_search_input");
	var options = {types: ["geocode"]};

	autocomplete = new google.maps.places.Autocomplete(geocoder_search_input, options);

	google.maps.event.addListener(autocomplete, 'place_changed', function() {
		var place = autocomplete.getPlace();
		show_location(place.geometry.location.lat(), place.geometry.location.lng());
	});

	$("footer a").click(function(e) {
		$.get("click_event", {href: $(this).attr("href")});
	});
	$("footer a").attr("target", "_blank");

	geolocate();
});
