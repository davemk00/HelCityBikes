
	
function findClosestStation(	originLatLng	) {
	//
	// This function finds the closest station to the marker
	// 1. Find all markers within buffer of the location marker
	// 2. Sort them by distance
	// 3. Pass five closest object lat/longs to a service which calculates the shortest

	var buffer = 2000;		// buffer for the search


	// if (!originLatLng) {originLatLng = map.getCenter()}  	// for debug purposes

	originLatLng 		= currLocationMarker.getLatLng();
	closestXStations 	= new Array();
	var stationDistances = new Array();
	
	stationData.forEach (  
		function (  station  ) {
			
			// Test if station has available bike
			//
			if (   station.bikesAvailable > 0   )  {
				
				// index stations and their distance
				//
				var markerLocation = new L.latLng(  station.y, station.x  );
				var distance = markerLocation.distanceTo ( originLatLng );
				if (  distance < buffer  ) {
					stationDistances.push([distance,station.id]);
				}
			}
		}
	);
	
	// Sort the array by distances
	stationDistances = stationDistances.sort(sortFunction).slice(0,5);
	function sortFunction(  a, b  ) {   if (a[0] === b[0]   ) { return 0; } else { return (a[0] < b[0]) ? -1 : 1; } };
	
	// Strip the distances, for only station Array
	stationDistances = stationDistances.map(function (item) { return item[1]});
	
	var i=0;
	// Test if station ID
	stationData.forEach(  function (  station  ) {
		tID = station.id;
		if (  stationDistances.includes(station.id)  ) {
			i += 1;
			closestXStations.push(station);					// Push station to new object
		}
	})
	
	if (  i == 0  )  {   
		alert("No stations found within " + (buffer/1000) + "km");
		return;
	};


	// setting up query for finding closest station by leaflet routing machine
	//
	var url = 'https://api.mapbox.com/directions-matrix/v1/mapbox/walking/' + originLatLng.lng + ',' + originLatLng.lat;

	for (var i = 0; i < closestXStations.length; i++) {
		
		url = url + ';' + closestXStations[i].x + "," + closestXStations[i].y;

	}
	url = url + "?sources=0&annotations=distance,duration&access_token=pk.eyJ1IjoiZGsxZTE4IiwiYSI6ImNqejZseHN3djBmNnMzbGw4eGw1bWtxYzIifQ.PQzt_AuRZ79O2JT-MCbmvw";
	
	// send request
	//
	var req = new XMLHttpRequest();    
	req.responseType = 'json';    
	req.open('GET', url, true);
	

	// set up an onload listener for the asyncronous data
	//
	req.onload = function ( ) {

		// Listen for onload of data from request
		//
		var jsonResponse 	= req.response;
		var distances 		= jsonResponse.distances[0];
		var min 			= 99999;
		
		for (var i = 1; i < distances.length; i++){
			if (distances[i] < min) {
				min = distances[i];
				minIndex = i;
			}			
		}
		

		// set up nearest station data
		//
		nearestStation 			= {};
		nearestStation.station 	= closestXStations[minIndex-1];
		nearestStation.distance	= min;
		nearestStation.latLng	= new L.LatLng(closestXStations[minIndex-1].y, closestXStations[minIndex-1].x);

		document.getElementById("originStation").value = nearestStation.station.name;

		
		// Plot the route
		//
		plotWalkRoute(	originLatLng	,	nearestStation	);

		return nearestStation;
		
	};
	req.send();
}



function plotWalkRoute(	  originLatLng , nearestStation   ) {

	// Plots the route from the current Location Marker to the closest station
	//
	if (  !originLatLng  )	{  originLatLng = currLocationMarker.getLatLng ( );  };


	// if there is a routeControl already, then delete.
	//
	if (  routeControl  ) {
		routeControl.remove( );
	};	

	
	// Mapbox routing through the leaflet routing machine provides best results, as it followed foot/forest paths better 
	// 	
	routeControl = L.Routing.control({
		profile:"mapbox/walking",
		router: L.Routing.mapbox('pk.eyJ1IjoiZGsxZTE4IiwiYSI6ImNqejZseHN3djBmNnMzbGw4eGw1bWtxYzIifQ.PQzt_AuRZ79O2JT-MCbmvw', { profile: 'mapbox/walking' }),
		waypoints: [
			originLatLng,
			nearestStation.latLng
			],
		routeWhileDragging: false,
		createMarker: function (  i, start, n  ) {
			//
			// Two Markers are created:
			//
			if (i == 0) {	
			// The first is the origin marker
			//
				var marker = new L.CircleMarker(originLatLng, {
					radius: 10,}
				)

			} else if (i == n-1) {
			// The second is the destination marker
			//
				var marker = new L.CircleMarker(nearestStation.latLng, {
					radius: 10,
					color:'red',
				}).bindTooltip(
					nearestStation.station.name + ' has ' + 
					nearestStation.station.bikesAvailable + ' free bikes. </br>' + 
					Math.round(nearestStation.distance) + ' metres away.',
					{permanent: true, direction: 'top'}).openTooltip();
			}
			
			document.getElementById(  'closestStationText'  ).innerHTML = nearestStation.station.name + ' has ' + 
				nearestStation.station.bikesAvailable + ' free bikes. </br>' + 
				Math.round(  nearestStation.distance  ) + ' metres away.'; 			// clear table
			
			return marker
		},
		fitSelectedRoutes: document.getElementById("autoZoom").checked,
	});

	routeControl.on(  "click", function ( ) {  event.originalEvent.stopPropagation( );  });

	routeControl.onAdd(  map  );
	
	
	// if there is a cycleRoute already then reroute it
	//
	if ( map.hasLayer(cycleRoute)	) {
		map.removeLayer(cycleRoute);
		cycleRoute.clearLayers();
		plotCycleRoute	( );
	};
	
}


var cycleRoute  = new L.featureGroup();

function plotCycleRoute	(   destLatLng   )	{
	// 
	// Using the Helsinki Public transport agency GraphQL as it provides optimsation according to safety
	// GraphQL is based on the Open Trip Planner
	// 
	
	// Check if origin set
	//
	if (!routeControl) { alert("Select an origin location"); return;}
	
	// Get coordinates from the walking control
	//
	var origLatLng  = routeControl.options.waypoints[1].lat + "," + routeControl.options.waypoints[1].lng;
	
	var destAddress = document.getElementById("originText").value;
	var destLatLng  = document.getElementById("destText").textContent;

	var url = "https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql";
	
	const query = `
{
  plan(
    fromPlace: "`	+ origLatLng +	`"
    toPlace: "`		+ destLatLng +	`"
  	transportModes: [{mode: BICYCLE}]
    optimize: SAFE
  ) {
    itineraries {
      legs {
        mode
        duration
        distance
        legGeometry {
          points
        }
      }
    }
  }
}
`;

	// Set up options
	//
	const opts = {
	  method: "POST",
	  headers: { "Content-Type": "application/json" },
	  body: JSON.stringify({ query })
	};


	// fetch the route
	//
	obj={};
	resp = fetch(  url, opts  )
		.then(   res => res.json()  )
		.then(  data => obj = data  )
		// .then(console.log)
		.then(      function ( ) {  plotRoute(  obj  )  }      )
		.catch(  console.error  );
	
	
	
	function plotRoute (    ) {		
		
		// if there is a cycleRoute already, then delete.
		//
		if (   map.hasLayer(  cycleRoute  )   ) {
			map.removeLayer(  cycleRoute  );
			cycleRoute.clearLayers( );
		};
		
		// Check if a destination is selected
		//
		if (  obj.data.plan.itineraries.length == 0  ) { 
			alert("Select a destination - type and clock search"); 
			return;
		}
		
		var nLegs = obj.data.plan.itineraries[0].legs.length;
		
		// setup distance and duration counters
		//
		var totalDistance = 0;
		var totalDuration = 0;
		
		// Loop through legs and add together
		//
		for ( i = 0; i < nLegs; i++ ) {
			var route = obj.data.plan.itineraries[0].legs[i].legGeometry.points;

			polyline = L.Polyline.fromEncoded(  route  ).addTo(  cycleRoute  );
			polygon = L.Polyline.fromEncoded(  route , {
				weight: 1,
				color: '#f30'
			}).addTo(  cycleRoute  );
			
			totalDistance += obj.data.plan.itineraries[0].legs[i].distance;
			totalDuration += obj.data.plan.itineraries[0].legs[i].duration;
			
		};
		cycleRoute.addTo(map);
		
		totalDistance = (totalDistance/1000).toFixed(2);
		totalDuration = (totalDuration/60).toFixed(1);
		
		// Add text to right edge overlay
		//
		document.getElementById(  'cycleRouteText'  ).innerHTML = document.getElementById(  'destText'  ).value + " is " +
			totalDistance + " metres away from " + document.getElementById(  'originStation'  ).value + ". It is will take approximately " +
			totalDuration + " minutes to cycle there."
		
		// Zoom if autoZoom setting checked
		//
        if (  document.getElementById('autoZoom').checked  ) {  map.fitBounds(  cycleRoute.getBounds( )  );  };
		
	}
}



