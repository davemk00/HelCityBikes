function sendFaultData() {

	if (!bikeID2)	{   var bikeID2		=   document.getElementById(   'bikeID2'		).value};
	if (!stationID2){   var stationID2	=   document.getElementById(   'stationID2'		).value};
	if (!issuecode)	{   var issuecode	=   document.getElementById(   'issuetext'		).selectedIndex};
	if (!issuetext)	{   var issuetext	=   document.getElementById(   'issuetext'		).value};
	if (!severity)	{   var severity 	=   document.getElementById(   'severity'		).value};
	if (!comment)	{   var comment 	=   document.getElementById(   'comment'		).value};
	if (!latitude)	{   var latitude 	=   0  };		// This should come from the map
	if (!longitude)	{   var longitude 	=   0  };		// This should come from the map
	

	// setup url	
	var url = serverUrl + "php/sendFaultData.php?" + 
		"bikeid="			+	bikeID2		+	
		"&stationid="		+	stationID2	+	
		"&issuecode="		+	issuecode	+	
		"&issuetext="		+	issuetext	+	
		"&severity="		+	severity	+	
		"&comment="			+	comment		+
		"&latitude="		+	latitude	+	
		"&longitude="		+	longitude;
	
	// Send the ajax
	$.ajax({
		type: 	'put',
		url: 	url,
		success:function(data) {
			console.log("success");
			writeFaultTable ( );
		}
	});
}






function sendBikeData(bikeID1,city)	{	
	
	if (!bikeID1)	{var bikeID1 = 	document.getElementById(	'bikeID1'	).value}
	if (!city)		{var city 	= 	document.getElementById(	'city'		).value}
		
		
	// Send the ajax	
	$.ajax({
		type: 	'put',
		url: 	serverUrl + "php/sendBikeData.php?" +
					"bikeid=" + bikeID1 + "&city=" + city,
		success:function(data) {
			console.log("success");
		}
	});
}






function sendStationData()	{	
	
	if (!stationID1)	{	var stationID1		= 	document.getElementById(	'stationID1'	).value}
	if (!stationName)	{	var stationName		= 	document.getElementById(	'stationName'	).value}
	if (!address)		{	var address 		= 	document.getElementById(	'address'		).value}
	if (!slots)			{	var slots 			=	document.getElementById(	'slots'			).value}
	if (!bikes)			{	var bikes 			= 	document.getElementById(	'bikes'			).value}
	if (!slotsAvailable){	var slotsAvailable	= 	document.getElementById(	'slotsAvailable').value}
	if (!latitude)		{	var latitude 		= 	123}		// This should come from the map
	if (!longitude)		{	var longitude		= 	11}			// This should come from the map
	if (!stationStatus)	{	var stationStatus	= 	document.getElementById(	'status'		).value}
	
	
	// setup url
	var url = serverUrl + "php/sendStationData.php?" + 
		 "stationid="		+	stationID1		+	
		"&name="			+	stationName		+	
		"&address="			+	address			+	
		"&slots="			+	slots			+	
		"&bikesAvailable="	+	bikes			+	
		"&slotsAvailable="	+	slotsAvailable	+	
		"&latitude="		+	latitude		+	
		"&longitude="		+	longitude		+	
		"&status="			+	stationStatus;
	
	
	// Send the ajax
	$.ajax({
		type: 	'put',
		url: 	url,
		success:function(data) {
			console.log("success");
		}
	});
}



