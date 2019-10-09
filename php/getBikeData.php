<?php 
	//Returns JSON data to Javascript file
	header("Content-type:application/json");

	$dbname = 'citybikesSQL';
	$dbuser = 'user1';
	$dbpass = 'DPyoQuzRbGu8Nw6g';
	$dbhost = 'localhost';

	$link = mysqli_connect($dbhost, $dbuser, $dbpass) or die("Unable to Connect to '$dbhost'");
	mysqli_select_db($link, $dbname) or die("Could not open the db '$dbname'");

	$test_query = "SELECT `bikes`.* FROM `bikes`";
	$result = mysqli_query($link, $test_query);
		
	while($row = mysqli_fetch_array($result)) {
		$data[] = array("bikeID" => $row["bikeid"], "City" => $row["city"]);
	}

	echo json_encode($data);
	
	mysqli_close($link);
?>
