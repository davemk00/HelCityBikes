<?php 
	//Returns JSON data to Javascript file
	header("Content-type:application/json");
	
	// get the variables from the search string
	$bikeid = 	$_GET["bikeid"];
	$city 	= 	$_GET["city"];
	
	// Setup variables for connecting to the server adn database
	$dbname = 'citybikesSQL';
	$dbuser = 'user1';
	$dbpass = 'DPyoQuzRbGu8Nw6g';
	$dbhost = 'localhost';

	// connect the to the server
	$link = mysqli_connect($dbhost, $dbuser, $dbpass) or die("Unable to Connect to '$dbhost'");
	
	// Select the database
	mysqli_select_db($link, $dbname) or die ("Could not open the db '$dbname'");
	
	// Find the max uid value
	// BUT IT DOESN'T WORK!!
	$sql	=	'SELECT MAX(`uid`) FROM bikes';
	$result	=	mysqli_query( 	$link ,	$sql	);
	$max 	= 	mysqli_fetch_array(	$result	);
	$max 	= 	intval($max);
	$max	=	$max + 1;
	
	
	// create query string
	$sql  	= 	"
		INSERT INTO `bikes` (`id`, `bikeid`, `city`) 
		VALUES ('".
			$max	."','".
			$bikeid	."','".
			$city	."');";
	
	// run query
	mysqli_query( 	$link , 	$sql 	);
	 
/* 	if ( $link -> query($sql) === TRUE ) {
		echo "New record created successfully";
	} else {
		echo "Error: " . $sql . "<br>" . $link->error;  
	} */
	
	mysqli_close($link);
?>

