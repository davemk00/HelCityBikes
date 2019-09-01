function fetchData()	{	
	//Define array to hold results returned from server
	stationData = new Array();
		
	//AJAX request to server; accepts a URL to which the request is sent 
	//and a callback function to execute if the request is successful.
	//API details: http://api.citybik.es/v2/
	$.ajax({
		dataType: "json",
		url: 'https://api.citybik.es/v2/networks/citybikes-helsinki?fields=stations',
		success: function(data){
			$.each(data,function(){
				stationData = this.stations;
			});
			plotStationData();
			writeTable(mymap.getBounds())
		},
		error: function(){
			console.log("Ajax Error",arguments);
		}
	});
}


