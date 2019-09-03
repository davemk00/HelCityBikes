var mymap;
var allStationsGroup = new L.featureGroup();
var latlng = [60.2480, 24.9280];
//var currentMarker;
var routeControl;

function initMap(){
	// fetch the data first - this to avoid issues with rescaling/rezooming
	fetchData();
	
	// Set up map view port of map
	// Set as whole Helsinki view
	mymap = L.map('mymap').setView(latlng, 10);
	
	// Set up action listeners
	mymap.on('moveend',	function (e) { refreshTable(); });
	
	mymap.on("click", function (event) {
				
		findClosestStation(event.latlng);
		
		if (routeControl) {
			routeControl.remove();
		}
		
		routeControl = L.Routing.control({
			profile:"mapbox/walking",
			router: L.Routing.mapbox('pk.eyJ1IjoiZGsxZTE4IiwiYSI6ImNqejZseHN3djBmNnMzbGw4eGw1bWtxYzIifQ.PQzt_AuRZ79O2JT-MCbmvw', { profile: 'mapbox/walking' }),
			waypoints: [
				event.latlng,
				nearest.latLng
				],
			routeWhileDragging: true,
			createMarker: function(i, start, n) {
				if (i == 0) {	
					var marker = new L.CircleMarker(event.latlng, {
						radius: 10,}
					)		
				} else if (i == n-1) {
					var marker = new L.CircleMarker(nearest.latLng, {
						radius: 10,
						color:'red',
					}).bindTooltip(
						nearest.name + ' has ' + 
						nearest.station.free_bikes + ' free bikes. </br>' + 
						Math.round(nearest.distance) + ' metres away.',
						{permanent: true, direction: 'top'}).openTooltip();
				}
				return marker
			}
		})
		.on("click", function () {event.originalEvent.stopPropagation();});
		
		var rB = routeControl.onAdd(mymap);
	});



	// import tile layer from mapbox
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
		attribution: 'Map data &copy; from , Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox.streets',  // mapbox.mapbox-streets-v7
		accessToken: 'pk.eyJ1IjoiZGsxZTE4IiwiYSI6ImNqejZseHN3djBmNnMzbGw4eGw1bWtxYzIifQ.PQzt_AuRZ79O2JT-MCbmvw'
	}).addTo(mymap);
	
	
	// Temporary actions to simulate new location retrieved:
	zoomToRandom();
}

function plotStationData() {
	
	//allStationsGroup.addTo(mymap);
	
	for (var i = 0; i < stationData.length; i++) {
		
		// Setting up layer Using Circle Marker and color
		// create location
		var markerLocation = new L.LatLng(stationData[i].latitude, stationData[i].longitude);
		// Set colour according to number of free bikes
		var markerCol = markerColour(stationData[i].free_bikes);
		if (stationData[i].free_bikes ==0) {var fillVal = 0;} else {var fillVal = 1;}
		// Create Marker and set pop up
		var allMarkers = new L.CircleMarker(markerLocation, {
				uid:stationData[i].extra.uid,
				radius:3,
				fillOpacity: 1,
				color: 'black',
				fillColor: markerCol,
				weight: 1,
				fill:fillVal,})
			.bindPopup(stationData[i].name + " " + stationData[i].extra.uid  + "<br>"+ stationData[i].free_bikes + "<br>" + stationData[i].latitude + "<br>" + stationData[i].longitude)
			.addTo(mymap)
			.addTo(allStationsGroup);
	}
	
	// mymap.fitBounds(allStationsGroup.getBounds());  //This was used previously to move the bounds as more data was added. Not necessary for this application
}

function getStationsInMapBounds(coords) {
	// constructs a list of stations that appear in the map bounds
	stationsInRangeArray = new Array();
	stationsInRangeLayerGroup  = new L.featureGroup();
	
	for (var i = 0; i< stationData.length; i++) {
		if ((stationData[i].latitude < coords._northEast.lat && stationData[i].latitude > coords._southWest.lat) && (stationData[i].longitude < coords._northEast.lng && stationData[i].longitude > coords._southWest.lng)) 
		{
			// Append to array
			stationsInRangeArray.push(stationData[i]);
			
			// make feature
			var markerLocation = new L.LatLng(stationData[i].latitude, stationData[i].longitude);
			// add to layer
			var inBoundsStations = new L.marker(markerLocation, { 
				uid:stationData[i].extra.uid,
				free_bikes: stationData[i].free_bikes,
				name: stationData[i].name
			})
			.addTo(stationsInRangeLayerGroup);
		}
	}
}

function markerColour(numBikes) {
	if (numBikes == 0) {
		return 'Clear';
	} else if (numBikes < 3) {
		return 'Red';
	} else if (numBikes < 6) {
		return 'Orange';
	} else {
		return 'Green';
	}
}

