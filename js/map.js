// Global variables
//
var map;

var centrelatlng = [60.24, 24.9280];	// centres on Helsinki
var routeControl;						
var currLocationMarker;  				// variable for the person position

function initMap( ) {
	
	// fetch the station data
	//fetchFaultData ( );
	fetchData ( );
	
	// Set data refresh interval
	setRefreshInt(   document.getElementById(  "refreshInt"  ).value   );
	
	
	// Set up map view port of map
	// Set as whole Helsinki view
	//
	map = L.map('map', {
		maxZoom: 	17
	})
	.setView(centrelatlng, 12);
	
	
	// Plot/Write the intial data		
	//
	plotStationData();
	writeStationTable(map.getBounds());
	
	
	// Set up listeners
	//
	// map listeners
	//
	map.on('moveend',	function (e) { writeStationTable(); });
	map.on("click", function (event) {
		
		// Add/move the current location marker
		addLocationMarker(event.latlng);
	});
	//
	
	document.getElementById('dataButt').click();
	
	loadMap ( );	
}

function loadMap ( ) {
	
	// import tile layer from mapbox
	//
	
	var mapType = document.getElementById('mapType').value;
	
	switch (  mapType  ) {
		
		// switch to case the currently selected map
		
		case "mapbox.streets":
			
			var url = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}'
			var attribution =  'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>';
			var id = 'mapbox.streets';
			var accessToken = 'pk.eyJ1IjoiZGsxZTE4IiwiYSI6ImNqejZseHN3djBmNnMzbGw4eGw1bWtxYzIifQ.PQzt_AuRZ79O2JT-MCbmvw';
			break;
			
		case "mapbox.outdoors":
		
			var url = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}'		
			var attribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>';
			var id = 'mapbox.outdoors';
			var accessToken = 'pk.eyJ1IjoiZGsxZTE4IiwiYSI6ImNqejZseHN3djBmNnMzbGw4eGw1bWtxYzIifQ.PQzt_AuRZ79O2JT-MCbmvw';
			break;
			
		case "tf.cycle":
		
			var url = 'https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey={accessToken}'
			var attribution = 'Maps © <a href="http://www.thunderforest.com">Thunderforest</a>, Data © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>';
			var accessToken = '738819c9bec2425f9266cc1cd1a5309f';
			var id = 'cycle';
			break;
		
		case "tf.landscape":
		
			var url = 'https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey={accessToken}'
			var attribution = 'Maps © <a href="http://www.thunderforest.com">Thunderforest</a>, Data © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>';
			var accessToken = '738819c9bec2425f9266cc1cd1a5309f';
			var id = 'landscape';
			break;
		
		
		case "tf.outdoors":
		
			var url = 'https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey={accessToken}'
			var attribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>';
			var accessToken = '738819c9bec2425f9266cc1cd1a5309f';
			var id = 'outdoors';
			break;
		
		
	}
	

	L.tileLayer(  url  , {
		attribution: attribution,
		id: id,
		accessToken: accessToken
	}).addTo(map);
	
}



function getStationsInMapBounds() {
	//
	// Fetches all stations within map bounds for speed
	
	
	var coords = map.getBounds();
	
	
	// constructs a list of stations that appear in the map bounds
	//
	stationsInRangeArray = new Array();  // clear list
	stationsInRangeLayerGroup  = new L.featureGroup(); // redundant??
	
	for ( var i = 0; i < stationData.length; i++ ) {		// TODO: change to foreach function
		
		// test whether in the current bounds of the map
		//
		if (	
			(	stationData[i].y < coords._northEast.lat 	  && 
				stationData[i].y > coords._southWest.lat	) && 
			(	stationData[i].x < coords._northEast.lng 	  && 
				stationData[i].x > coords._southWest.lng	)) 
		{
			// Append to array
			//
			stationsInRangeArray.push(	stationData[i]	);
			
			// make feature
			//
			var markerLocation = new L.LatLng(	stationData[i].y, stationData[i].x	);
			
			// add to layer  ---- Possibly redundant ??
			//
			new L.marker(markerLocation, { 
				id:				stationData[i].id,
				bikesAvailable:	stationData[i].bikesAvailable,
				name: 			stationData[i].name
				})
				.addTo(stationsInRangeLayerGroup);
			
		}	
	}
}




function getStationsInRect( buff ) {
	
	// Fetches all stations within ~2km wide rectangle
	var coords = currLocationMarker.getLatLng();	
	
	// constructs a list of stations that appear in the map bounds
	//
	selStationsArray = new Array();  // clear list	
	selStations  = new L.featureGroup(); // redundant??
	
	stationData.forEach (  
		function (  station  ) {
			var latLng = station.latLng;
			
			
			if (	latlng.distanceTo ( latLng )	) { 


				var markerLocation = new L.LatLng(	stationData[i].y, stationData[i].x	);
			
				// add to layer  ---- Possibly redundant ??
				//
				new L.marker(markerLocation, { 
					id:				stationData[i].id,
					bikesAvailable:	stationData[i].bikesAvailable,
					name: 			stationData[i].name
					})
					.addTo(selStations);
				stationsInRangeArray.push(  station  );
			}
		}
	);
}
