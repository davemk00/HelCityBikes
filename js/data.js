// var serverUrl = "http://192.168.88.100/";
var serverUrl = "http://helcitybikes.hopto.org/";

var faultData = new Array();
 
function fetchData ( )  {	
	//
	// Fetches the bike data from HSLs digitransit API and then the fault data from MariaDB/MySQL database


	//Define/clear array to hold results returned from server
	stationData = new Array();
	
	// Below are alternative sources for the data

	//The basic source API source is https://api.digitransit.fi/routing/v1/routers/hsl/bike_rental
	$.ajax({
		dataType: "json",
		url: 'https://api.digitransit.fi/routing/v1/routers/hsl/bike_rental',
		success: function(  data  ){
			stationData = data.stations;
			plotStationData ( );
			writeStationTable (  map.getBounds()  );
		},
		error: function(){
			console.log("Ajax Error",arguments);
		}
	});

}




function fetchFaultData ( ) {

	// get all the fault data from local database
	$.getJSON(   serverUrl + "php/getFaultData.php"   , function(  results  )	{
		
		// with the results, save to global array
		//
		faultData = results;
		
		writeFaultTable ( );
		
	});
	
};
