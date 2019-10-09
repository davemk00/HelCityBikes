function writeStationTable(coords)	{
	getStationsInMapBounds(coords);
	
	document.getElementById('stationsInRangeTable').innerHTML = ''; // clear table
	
	document.getElementById('stationsInRangeTable').innerHTML +=
		"<table style='width:50%'><tr>" + 
		"<th>ID</th>" + 
		"<th>Name</th>" + 
		"<th>Bikes free/Total</th></tr>"
		//<th>Distance/Total</th>
	for (var i = 0; i < stationsInRangeArray.length; i++) {
		document.getElementById('stationsInRangeTable').innerHTML += "<tr>" + 
				"<td>" + stationsInRangeArray[i].id		+ "</td>" + 
				"<td>" + stationsInRangeArray[i].name	+ "</td>" + 
				"<td>" + stationsInRangeArray[i].bikesAvailable + "/" + (  stationsInRangeArray[i].spacesAvailable + stationsInRangeArray[i].bikesAvailable  ) + "</td>" + 
			"</tr>";
	}
	document.getElementById('stationsInRangeTable').innerHTML += "</table>";
}



function writeFaultTable ( ) {
	
	// Clear the table if it already exists:
	//
	if (  typeof document.getElementById('faultDataTable').innerHTML !== null  ) {  
		document.getElementById('faultDataTable').innerHTML = ''; // clear table}  
	};
	
	document.getElementById('faultDataTable').innerHTML +=
		"<table><tr>" + 
		"<th>ID</th>" + 
		"<th>Bike</th>" + 
		"<th>Station</th>" + 
		"<th>Issue</th>" + 
		"<th>Rating</th>" + 
		"<th>Lat</th>" + 
		"<th>Lng</th>" + 
		"</tr>"
		
	faultData.forEach (   function (   fault   )  { 
		document.getElementById('faultDataTable').innerHTML += "<tr>" + 
			"<td>" + fault.bikeID		+ "</td>" + 
			"<td>" + fault.stationID	+ "</td>" + 
			"<td>" + fault.issueCode	+ "</td>" + 
			"<td>" + fault.issueText	+ "</td>" + 
			"<td>" + fault.severity		+ "</td>" + 
			"<td>" + fault.latitude		+ "</td>" + 
			"<td>" + fault.longitude	+ "</td></tr></table>";
	});
	
}
