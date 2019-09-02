//var mymap;

function zoomToRandom()	{
	// lat range [60.1479, 60.1935]
	// long range [24.7214, 25.1062] 
	// setting Longitude to be only Helsinki. i.e. excluding Vantaa

	var randLat = 60.1935 + ((Math.random() * 0.0456) - 0.0228);
	var randLng = 24.9138 + ((Math.random() * 0.3848) - 0.1924);
	var randZoom = Math.floor(Math.random()*4) + 12;

	mymap.setView([randLat, randLng], randZoom);
}


var currLocationMarker;

function addCurrLocationMarker(latlng) {
	console.log('test');
	if (currLocationMarker) {
		console.log(currLocationMarker);
		mymap.removeLayer(currLocationMarker);
		currLocationMarker.setLatLng(latlng.latlng);
	}
	currLocationMarker = L.marker(latlng, {'draggable': true,})
				.addTo(mymap);
	
	mymap.addLayer(currLocationMarker);
	//currLocationMarker.on('moveend', function(e) {findClosestStation(e.target.getLatLng())});
	findClosestStation(currLocationMarker.getLatLng());
	fetchLeafletRoutingMachineMapbox();
}
	
	
var nearest;
function findClosestStation(latLng) {
	if (!latLng) {latLng = currLocationMarker.getLatLng();}
	
	// Find the closest station to the location of currLocationMarker
	// Two methods:
	
	// Method 1 - using layers
	nearest = {};
	selStationsGroup.eachLayer(function(station) {
		if (station.options.free_bikes > 0) {
			var distance = latLng.distanceTo(station.getLatLng());
			if (!nearest.station) {
				nearest.station = station;
				nearest.distance = distance;
				nearest.latLng = station.getLatLng();
			} else if (distance < nearest.distance) {
				nearest.station = station;
				nearest.distance = distance;
				nearest.latLng = station.getLatLng();
			}
		}
	});
	
	
	/*
	// Method 2 - using array
	var nearest2 = {};
	for (var i = 0; i < stationsInRange.length; i++) {
		
		var stationLocation = new L.LatLng(stationsInRange[i].latitude, stationsInRange[i].longitude);
		var distance = latLng.distanceTo(stationLocation);
		
		if (!nearest2.station) {
			nearest2.station = stationsInRange[i];
			nearest2.distance = distance;
		} else if (distance < nearest2.distance) {
			nearest2.station = stationsInRange[i];
			nearest2.distance = distance;
		}
	}
	*/
	
	document.getElementById('closestStation').innerHTML = 'The Closest Bike Station is station id ' + nearest.station.options.uid + ' at ' + Math.round(nearest.distance) + 'm. It has ' + nearest.station.options.free_bikes + ' free bikes';
	
	//fetchLeafletRoutingMachineMapbox();
}




function clearData()	{
	// Not used anymore, was for debugging purposes	
	document.getElementById('stationText').innerHTML = '';
	mymap.removeLayer(allStationsGroup);
}


function printDebugData() {
//	console.log(mymap.getCenter());
	//console.log("zoom: " + mymap.getZoom());
	// console.log(selStationsGroup);
	console.log(currLocationMarker.getLatLng().lat);
	console.log(currLocationMarker.getLatLng().lng);
	console.log(nearest.station.getLatLng().lat);
	console.log(nearest.station.getLatLng().lng);
}


function fetchLeafletRoutingMachineMapbox(latLng) {
	var control = L.Routing.control({
		profile:"mapbox/walking",
		router: L.Routing.mapbox('pk.eyJ1IjoiZGsxZTE4IiwiYSI6ImNqejZseHN3djBmNnMzbGw4eGw1bWtxYzIifQ.PQzt_AuRZ79O2JT-MCbmvw', { profile: 'mapbox/walking' }),
		waypoints: [
			L.latLng(latLng),
			L.latLng(nearest.station.getLatLng())
			],
		routeWhileDragging: true
		})
		.on("click", function () {event.originalEvent.stopPropagation();});
	var rB = control.onAdd(mymap);
}
