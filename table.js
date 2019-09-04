function refreshTable() {
	writeTable(mymap.getBounds());
}



function writeTable(coords)	{
	getStationsInMapBounds(coords);
	
	document.getElementById('stationsInRangeTable').innerHTML = ''; // clear table
	
	document.getElementById('stationsInRangeTable').innerHTML +=
		"<table style='width:50%'>" + 
		"<tr><th>ID</th><th>Name</th><th>Bikes free/Total</th></tr>"
		//<th>Distance/Total</th>
	for (var i = 0; i < stationsInRangeArray.length; i++) {
		document.getElementById('stationsInRangeTable').innerHTML += "<tr>" + 
				"<td>" + stationsInRangeArray[i].extra.uid + "</td>" + 
				"<td>" + stationsInRangeArray[i].name + "</td>" + 
				"<td>" + stationsInRangeArray[i].free_bikes + "/" + (stationsInRangeArray[i].empty_slots+stationsInRangeArray[i].free_bikes) + "</td>" + 
			"</tr>";
	}
	document.getElementById('stationsInRangeTable').innerHTML += "</table>";
}












