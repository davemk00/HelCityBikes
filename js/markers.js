var disableClusteringAtZoom = 12;		// setting for the marker clustering
markers=[];


// colors to use for the categories
var colors = ['green', 'orange', 'red', '#blue','#00000000'];

function addLocationMarker(  latLng  ) {
		
	if (!latLng) {latLng = map.getCenter()};  //for debugging
	
	
	// Find the address based on LatLng
	// change the origin address text box to the address
	// 
	var address = fetch("https://api.digitransit.fi/geocoding/v1/reverse?point.lat=" + latLng.lat + "&point.lon=" + latLng.lng + "&size=1")
			.then(
				function(response) {
					return response.json();
				})
			.then(
				function(geojson) {
					var address = (   geojson.features[0].properties.label   );
					document.getElementById("originText").value = address;
					return address;
				}
			);


	// if a marker already exists, remove
	//
	if (currLocationMarker) {
		map.removeLayer(currLocationMarker);
		currLocationMarker.setLatLng(latLng.latLng);
	}
	

	// create location marker
	//
	currLocationMarker = L.marker(  latLng, {'draggable': true,}  )
		.bindPopup(  address  )
		.openPopup()
		.on('click', function() { this.closePopup();})
		.addTo(map);		
	
	// Add listener if moved
	//
	currLocationMarker.on('moveend', function(e) {	
		findClosestStation(   e.target.getLatLng()   );
	});
	
	
	// Find the closest marker
	//
	findClosestStation(  currLocationMarker.getLatLng( )  );

	
	// simulate a click on the tab to open it and correctly set styles
	document.getElementById(  'routeButt'  ).click( );
}


function plotStationData() {
	
	/*  Plotting the station data.
		Three methods are provided below
		1.	Individual markers
		2.	Clustering of markers
		3.	Doughnut/pie charts svg icons
		
		Controlled by the markerCluster checkbox
	*/
	
	
	map.removeLayer(markers);
	
	
	if (   document.getElementById('markerType').value == 'simple'   ) {
		// Method 1: using simple 3 colour Individual Markers
		// This shows availability of bikes by colour
			// Green has more than 6 bikes
			// Orange has 3-5 bikes
			// Red has 1 or 2 bikes
			// Clear has no bikes
		
		
		plotStationDataAsSimpleIcons();		
		
	}   else if   (   document.getElementById('markerType').value == 'clustered'   ) {
		// Method 2: using the cluster group leaflet library
		// https://github.com/Leaflet/Leaflet.markercluster 
		// with some alterations trying to make spiderfy move markers to acual positions
		// extScripts/markercluster.js
		
		plotStationDataAsClusteredIcons();


	} else if (   document.getElementById('markerType').value == "pieIcon" ) {
		// Method 3: using a segmented doughnut to reporesent bike available, spaces available and faults.
		
		plotStationDataAsDoughnutIcons();
	}



	function plotStationDataAsSimpleIcons ( ) {
		
		// Method 1: Individual Markers
		// This shows availability of bikes by colour
		// Green has more than 6 bikes
		// Orange has 3-5 bikes
		// Red has 1 or 2 bikes
		// Clear has no bikes
			
		markers = new L.featureGroup();
		
		for ( var i = 0; i < stationData.length; i++ ) {

			// Setting up layer Using Circle Marker and color
			// create location
						
			var markerLocation = new L.LatLng(   stationData[i].y,stationData[i].x   );

			stationData[i].latLng = markerLocation;
			
			// Set colour according to number of free bikes
			var markerCol = markerColour(   stationData[i].bikesAvailable   );

			// Set clear if zero bikes
			if (  stationData[i].bikesAvailable == 0  ) {  var fillVal = 0;  } else {  var fillVal = 1;  };
			
			// Create Marker and set pop up
			var marker = new L.CircleMarker(markerLocation, {
					id: stationData[i].id,
					radius: 5,
					fillOpacity: 1,
					color: 'black',
					fillColor: markerCol,
					weight: 1,
					fill:fillVal}
				)
				.bindPopup(  generatePopup(   stationData[i] , 0  ))
				.addTo(markers);
		};
		map.addLayer(markers);
		
	}


	function plotStationDataAsClusteredIcons ( ) {
		
		
			// create markers object
			//
			markers = L.markerClusterGroup({
			
				// change the iconCreateFunction to show number of bikes available instead of the default, number of stations
				//
				iconCreateFunction: function(cluster) {

					// get all markers within a cluster and sum the number of bikes available
					//
					var markers = cluster.getAllChildMarkers();
					var n = 0;
					markers.forEach(function (marker) {
						n += marker.options.bikesAvailable;
					});
					
					// setup string for css based on number count
					//
					var childCount = cluster.getChildCount();
					var c = ' marker-cluster-';
					if (childCount < 10) {
						c += 'small';
					} else if (childCount < 100) {
						c += 'medium';
					} else {
						c += 'large';
					}		
					

					return L.divIcon({ html: '<div><span>' + n + '</span></div>', className: 'mycluster', className: 'marker-cluster' + c, iconSize: new L.Point(40, 40) });


				},
				
				showCoverageOnHover: false,
				disableClusteringAtZoom: disableClusteringAtZoom,		// This is really a user choice. Testing would help. Or make it 		
				dummyOption: 0 
			
			});
		
		
			stationData.forEach (  function (station) {
				
				// Set colour according to number of free bikes
				//
				var markerCol = markerColour(station.bikesAvailable);

				// Set clear if zero bikes
				if (station.bikesAvailable ==0) {var fillVal = 0;} else {var fillVal = 1;}
				
				var markerLocation = new L.LatLng(station.y,station.x);
				var marker = new L.CircleMarker(markerLocation, {
					title: station.name,
					radius: 5,
					fillOpacity: 1,
					color: 'black',
					fillColor: markerCol,
					weight: 1,
					fill:fillVal,
					bikesAvailable: station.bikesAvailable,
				})
				

				// Add marker popup data
				//
				marker.bindPopup(  generatePopup(   stationData[i] , (Math.random()*3).toFixed(0)  )  )
				markers.addLayer(marker);
			})
		
		map.addLayer(markers);
		
	}


	function plotStationDataAsDoughnutIcons ( ) {
		
		// Method 3: Doughnut icons
		// icons appear as a doughnut of various data proportional segments with a numbe in the centre
		//
		// Green is the proporation of bikes available
		// Orange is the proporation of slots available
		// Red is number of faulty bikes
		
		map.removeLayer(markers);

		markers = new L.featureGroup();

		for ( var i = 0; i < stationData.length; i++ ) {
			
			var coords = [stationData[i].y,stationData[i].x];
			
			var markerLocation = new L.LatLng(stationData[i].x,stationData[i].y);
			
			stationData[i].latLng = markerLocation;
			
			var props = new Array;
			props.push(  stationData[i].bikesAvailable   );
			props.push(  stationData[i].spacesAvailable  );
			props.push(  Math.floor(Math.random() * 4)   );
			
			var el = createDonutChart(props);
			
			var iconUrl = el.outerHTML;
			
			var icon = L.divIcon({
				className: 'custom-div-icon',
				html: iconUrl,
				iconSize: [30, 42],
				iconAnchor: [15, 21]			
			});
			
			L.marker(coords,{icon:icon})
				.bindPopup(   generatePopup(   stationData[i], props[2]   ))
				.addTo(markers);
			
			
		}
		markers.addTo(map);
		
		
		
		// code for creating an SVG donut chart from feature properties
		// taken from https://docs.mapbox.com/mapbox-gl-js/example/cluster-html/
		// changed slightly
		function createDonutChart(counts) {
			var offsets = [];
			// var counts = [props.mag1, props.mag2, props.mag3, props.mag4, props.mag5];
			var total = 0;
			for (var i = 0; i < counts.length; i++) {
				offsets.push(total);
				total += counts[i];
			}
			var fontSize = total >= 1000 ? 11 : total >= 100 ? 10 : total >= 10 ? 9 : 16;
			var r = total >= 1000 ? 25 : total >= 100 ? 16 : total >= 10 ? 12 : 9;
			var r0 = Math.round(r * 0.6);
			var w = r * 2;

			var html = '<svg width="' + w + '" height="' + w + '" viewbox="0 0 ' + w + ' ' + w +
				'" text-anchor="middle" style="font: ' + fontSize + 'px sans-serif">';

			for (i = 0; i < counts.length; i++) {
				html += donutSegment(offsets[i] / total, (offsets[i] + counts[i]) / total, r, r0, colors[i]);
			}
			html += '<circle cx="' + r + '" cy="' + r + '" r="' + r0 +
				'" fill="white" /><text dominant-baseline="central" transform="translate(' +
				r + ', ' + r + ')">' + counts[0].toLocaleString() + '</text></svg>';

			var el = document.createElement('div');
			el.innerHTML = html;
			return el.firstChild;
		}


		function donutSegment(start, end, r, r0, color) {
			if (end - start === 1) end -= 0.00001;
			var a0 = 2 * Math.PI * (start - 0.25);
			var a1 = 2 * Math.PI * (end - 0.25);
			var x0 = Math.cos(a0), y0 = Math.sin(a0);
			var x1 = Math.cos(a1), y1 = Math.sin(a1);
			var largeArc = end - start > 0.5 ? 1 : 0;

			return ['<path d="M', r + r0 * x0, r + r0 * y0, 'L', r + r * x0, r + r * y0,
				'A', r, r, 0, largeArc, 1, r + r * x1, r + r * y1,
				'L', r + r0 * x1, r + r0 * y1, 'A',
				r0, r0, 0, largeArc, 0, r + r0 * x0, r + r0 * y0,
				'" fill="' + color + '" />'].join(' ');
		}
	}


	function generatePopup(   station, nFaults   ) {
		
		// Creates HTML tagged fragment that populates popup.
		
		return "Station (" + station.id  + ") " + station.name + "<br>Has " + 
			station.bikesAvailable + " of " + (  station.bikesAvailable + station.spacesAvailable  ) + " spaces<br>" + 
			nFaults + " faults";
	}


	function markerColour(  numBikes  ) {
		if (numBikes == 0) {
			return colors[3];
		} else if (numBikes < 3) {
			return colors[2];
		} else if (numBikes < 6) {
			return colors[1];
		} else {
			return colors[0];
		}
	}	

}
