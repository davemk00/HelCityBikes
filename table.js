function refreshTable() {
	writeTable(mymap.getBounds());
}



function writeTable(coords)	{
	getStationsInMapBounds(coords);
	
	document.getElementById('stationText').innerHTML = ''; // clear table
	
	for (var i = 0; i < stationsInRangeArray.length; i++) {
		
		document.getElementById('stationText').innerHTML += 
			"id = " + stationsInRangeArray[i].extra.uid + ", text = " + 
			stationsInRangeArray[i].name + "  " + 
			stationsInRangeArray[i].free_bikes + "/" + (
			stationsInRangeArray[i].empty_slots+
			stationsInRangeArray[i].free_bikes) + "<br />";	
	}
}











