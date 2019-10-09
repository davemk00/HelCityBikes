<?php 
	//Returns JSON data to Javascript file
	header("Content-type:application/json");
	
	// get the variables from the search string
	$stationid		=	$_GET["stationid"];
	$name			=	$_GET["name"];	
	$address		=	$_GET["address"];		
	$slots			=	$_GET["slots"];	
	$bikesAvailable	=	$_GET["bikesAvailable"];
	$slotsAvailable	=	$_GET["slotsAvailable"];
	$latitude		=	$_GET["latitude"];
	$longitude		=	$_GET["longitude"];
	$status			=	$_GET["status="];
	
	
	// Setup variables for connecting to the server adn database
	$dbname = 'citybikesSQL';
	$dbuser = 'user1';
	$dbpass = 'DPyoQuzRbGu8Nw6g';
	$dbhost = 'localhost';

	// connect the to the server
	$link = mysqli_connect($dbhost, $dbuser, $dbpass) or die("Unable to Connect to '$dbhost'");
	
	// Select the database
	mysqli_select_db($link, $dbname) or die ("Could not open the db '$dbname'");
	
	
	// create query string
	$sql  = "INSERT INTO `stations` (`stationid`, `name`, `address`, `slots`, `bikesAvailable`, `slotsAvailable`, `latitude`, `longitude`, `status`) VALUES ('".
		$stationid		."','".
		$name			."','".
		$address		."','".
		$slots			."','".
		$bikesAvailable	."','".
		$slotsAvailable	."','".
		$latitude		."','".
		$longitude		."','".
		$status			."');";
	
	
	// run query
	mysqli_query(	$link, 	$sql	);
	 
/* 	if ( $link -> query($sql) === TRUE ) {
		echo "New record created successfully";
	} else {
		echo "Error: " . $sql . "<br>" . $link->error;  
	} */
	
	mysqli_close($link);
?>
