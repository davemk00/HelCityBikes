<?php 
	//Returns JSON data to Javascript file
	header("Content-type:application/json");
	
	$dbname = 'citybikesSQL';
	$dbuser = 'user1';
	$dbpass = 'DPyoQuzRbGu8Nw6g';
	$dbhost = 'localhost';
	
	$link = mysqli_connect( $dbhost, $dbuser, $dbpass ) or die("Unable to Connect to '$dbhost'");
	
	mysqli_select_db( $link, $dbname ) or die("Could not open the db '$dbname'");
	
	$query = "SELECT * FROM `feedback`";

	
	
	$result = mysqli_query( $link, $query );
		
	while($row = mysqli_fetch_array(  $result  )) {
		$data[] = array(
			"ID" => $row["id"], 
			"bikeID" => $row["bikeid"], 
			"stationID" => $row["stationid"],
			"issueCode" => $row["issuecode"],
			"issueText" => $row["issuetext"],
			"severity" => $row["severity"],
			"latitude" => $row["latitude"],
			"longitude" => $row["longitude"]
		);
	}

	echo json_encode($data);
	
	mysqli_close($link);
?>
