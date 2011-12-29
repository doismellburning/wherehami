function maidenhead(latitude, longitude)
{
	// http://en.wikipedia.org/wiki/Maidenhead_Locator_System
	// Hacks to avoid negative numbers...

	longitude += 180;
	longitude /= 2;

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

	return long1 + lat1 + long2 + lat2 + long3 + lat3 + " (" + latitude + ", " + longitude + ")";
}

function success(position)
{
	var location = maidenhead(position.coords.latitude, position.coords.longitude);

	$("#result").html(location);
	$("#result").addClass("success");
}

function failure(error)
{
	$("#result").html(error.message);
	$("#result").addClass("failure");
}
	

$(function() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(success, failure);
	} else {
		failure("Your browser does not support Geolocation"); //TODO Improve this failure message
	}
});
