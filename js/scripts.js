


function setRefreshInt(value) {
	
	// set interval seconds to collect query data
	value = parseInt(value);

	if (   Number(value) < Number(2)   ) {  value = 5;  };		// limit the amount of requests
	document.getElementById("refreshInt").value = value;		// minimum refresh rate

	setInterval(function(){		fetchData();	},  value * 10000   )
}


function zoomToRandom()	{
	// lat range [60.1479, 60.1935]
	// long range [24.7214, 25.1062] 
	// setting Longitude to be only Helsinki. i.e. excluding Vantaa

	var randLat = 60.1935 + ((Math.random() * 0.0456) - 0.0228);
	var randLng = 24.9138 + ((Math.random() * 0.3848) - 0.1924);
	var randZoom = Math.floor(Math.random()*4) + 12;

	map.setView([randLat, randLng], randZoom);
}


function clearData( ) {
	// Not used anymore, was for debugging purposes	
	document.getElementById('stationText').innerHTML = '';
	map.removeLayer(allStationsGroup);
}


function printDebugData() {
//	console.log(map.getCenter());
	//console.log("zoom: " + map.getZoom());
	console.log(stationsInRangeArray);
	console.log(stationsInRangeLayerGroup);
	console.log(stationData);
	console.log(nearestStation);
}




function setOrigFromAddress(   address   ) {
	var address = document.getElementById("originText").value;
	
	var url = "https://api.digitransit.fi/geocoding/v1/search?text=" + 
		address + "&layers=address&region=uusimaa&size=1";

	fetch(  url  )
		.then(  function(  response  ) {
			return response.json();
		})
		.then( function(  geojson  ) {
			var latLng = new L.LatLng(geojson.features[0].geometry.coordinates[1],geojson.features[0].geometry.coordinates[0]);
			
			document.getElementById("originText").textContent = [latLng.lat,latLng.lng];
			return latLng;
		})
		.then(  function(  latLng  ) {
			addLocationMarker(  latLng  );	
		});	
}




function setDestFromAddress(   address   ) {
	var address = document.getElementById("destText").value;
	
	var url = "https://api.digitransit.fi/geocoding/v1/search?text=" + 
		address + "&layers=address&region=uusimaa&size=1";

	fetch(url)
		.then( function(  response  ) {
			return response.json();
		})
		.then(  function(  geojson  ) {
			var latLng = new L.LatLng(geojson.features[0].geometry.coordinates[1],geojson.features[0].geometry.coordinates[0]);
			
			document.getElementById("destText").textContent = [latLng.lat,latLng.lng];
			return latLng;
		})
		.then(  function(  latLng  ) {
			// console.log(latLng);
			
		});	
}





// Routine to search for address suggestions
//
function autoCompleteAddress(   input, fieldID   ) {
	
	var url = "https://api.digitransit.fi/geocoding/v1/autocomplete?text=" + 
		input + "&focus.point.lat=60.17&focus.point.lon=24.93&layers=address";
		
	fetch(   url   )
		.then(   function(  response  ) {
			return response.json();
		})
		.then(   function(  geojson  ) {
							
			var nVals = geojson.features.length;			
			
			if (  nVals == 0 ) {
				var str = ''; 
			} else if (  nVals == 1  ) {
				var str = geojson.features[0].properties.name;
			} else if ( nVals > 1  ) {
				var str = geojson.features[0].properties.name + ", " + geojson.features[1].properties.name;
			}

			document.getElementById(   fieldID   ).innerHTML = str
			
		});	
}








// for the changing right box content on use of the tabs
function openTab(    evt, tabName    ) {
	
	var i, tabcontent, tablinks;
	tabcontent = document.getElementsByClassName(   "tabcontent"   );
	for (   i = 0; i < tabcontent.length; i++   ) {
		tabcontent[i].style.display = "none";
	}
	tablinks = document.getElementsByClassName(   "tablinks"   );
	for (   i = 0; i < tablinks.length; i++   ) {
		tablinks[i].className = tablinks[i].className.replace(   " active", "");
	}
	document.getElementById(  tabName  ).style.display = "block";
	evt.currentTarget.className += " active";
	
}
