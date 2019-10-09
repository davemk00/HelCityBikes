<?php 
	//Returns JSON data to Javascript file
	header("Content-type:application/json");

	$dbname = 'citybikesSQL';
	$dbuser = 'user1';
	$dbpass = 'DPyoQuzRbGu8Nw6g';
	$dbhost = 'localhost';

	$link = mysqli_connect($dbhost, $dbuser, $dbpass) or die("Unable to Connect to '$dbhost'");
	mysqli_select_db($link, $dbname) or die("Could not open the db '$dbname'");

	$test_query = "SELECT * FROM `stations`";
	$result = mysqli_query($link, $test_query);
		
	while($row = mysqli_fetch_array($result)) {
		$data[] = array(
			"stationID" => $row["stationid"],
			"name" => $row["name"],
			"address" => $row["address"],
			"slotsTotal" => $row["slots"],
			"bikesAvailable" => $row["issuecode"],
			"slotsAvailable" => $row["issuetext"],
			"latitude" => $row["latitude"],
			"longitude" => $row["longitude"],
			"status" => $row["longitude"]
		);
	}

	echo json_encode($data);
	
	mysqli_close($link);
?>
