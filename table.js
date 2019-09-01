function refreshTable() {
	writeTable(mymap.getBounds());
}



function writeTable(coords)	{
	getStationsInMapBounds(coords);
	
	document.getElementById('stationText').innerHTML = ''; // clear table
	
	for (var i = 0; i < stationsInRange.length; i++) {
		
		document.getElementById('stationText').innerHTML += 
			"id = " + stationsInRange[i].extra.uid + ", text = " + stationsInRange[i].name + "  " + stationsInRange[i].free_bikes + "/" + (stationsInRange[i].empty_slots+stationsInRange[i].free_bikes) + "  " 
			//+ ", coordinates = " + stationsInRange[i].latitude + ", " + stationsInRange[i].longitude 
			+ "<br />";	
	}
}











