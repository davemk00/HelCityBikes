<?php 
	//Returns JSON data to Javascript file
	header("Content-type:application/json");
		
	array_filter($_GET, 'trim_value');
	
	function trim_value(&$value){
		$value = trim($value);
		$pattern = "/[\(\)\[\]\{\}]/";
		$value = preg_replace($pattern," - ",$value);
	}
	
	$pattern = "/[^A-Za-z0-9\s\.\:\-\+\!\@\°\,\'\"]/";

	function sanitize($str, $filter, $pattern) {
		$sanStr = preg_replace(  $pattern,  "",  $str  );
		$sanStr = filter_var(  $sanStr  ,   $filter  );
		if (  strlen($sanStr) > 255  ) $sanStr = substr(  $sanStr,0,255  );
		return $sanStr;
	} 
	
	 
	// get the variables from the search string	
	$bikeid			= sanitize(  $_GET["bikeid"]    ,FILTER_SANITIZE_SPECIAL_CHARS,$pattern);
	$stationid		= sanitize(  $_GET["stationid"] ,FILTER_SANITIZE_SPECIAL_CHARS,$pattern);
	$issuecode		= sanitize(  $_GET["issuecode"] ,FILTER_SANITIZE_SPECIAL_CHARS,$pattern);
	$issuetext		= sanitize(  $_GET["issuetext"] ,FILTER_SANITIZE_SPECIAL_CHARS,$pattern);
	$severity		= sanitize(  $_GET["severity"]  ,FILTER_SANITIZE_SPECIAL_CHARS,$pattern);
	$comment 		= sanitize(  $_GET["comment"]   ,FILTER_SANITIZE_SPECIAL_CHARS,$pattern);
	$latitude		= sanitize(  $_GET["latitude"]  ,FILTER_SANITIZE_SPECIAL_CHARS,$pattern);
	$longitude		= sanitize(  $_GET["longitude"] ,FILTER_SANITIZE_SPECIAL_CHARS,$pattern);
	
	
	
	echo $comment;
	
	
	
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
	$sql = "
		INSERT INTO `feedback` (`bikeid`, `stationid`, `issuecode`, `issuetext`, `severity`, `comment`, `latitude`, `longitude`) VALUES ('".
		$bikeid		."','".
		$stationid	."','".
		$issuecode	."','".
		$issuetext	."','".
		$severity	."','".
		$comment	."','".
		$latitude	."','".
		$longitude	."');";
	
	// run query
	mysqli_query(	$link, 	$sql	);
	 
 	if ( $link -> query($sql) === TRUE ) {
		echo "New record created successfully";
	} else {
		echo "Error: " . $sql . "<br>" . $link->error;  
	}
	
	mysqli_close($link);
?>
