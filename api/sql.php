<?php

$servername = "localhost:3306";
$username = "taking1n1";
$password = "TcHC8fh1p2dAx2aD";

/**
 * Returns global MySQL instance; not linked to any database
 */
function getGlobalMySQLInstance()
{
	// Gets globals
	global $servername, $username, $password;

	// Creates connection
	$conn = new mysqli($servername, $username, $password);
	$conn->set_charset("utf8");

	// If there's a problem, state error
	if ($conn->connect_errno) {
		trigger_error("Couldn't connect to database: " . $conn->connect_error);
	} else {
		// Returns this instance
		return $conn;
	}
}

/**
 * Returns MySQL instance linked to 'lists' db
 */
function getMySQLInstance()
{
	// Gets globals
	global $servername, $username, $password;
	
	// Creates connection
	$conn = new mysqli($servername, $username, $password, "lists");
	$conn->set_charset("utf8");

	// If there is no db
	if ($conn->connect_errno == 1049) {
		// Create it and try again
		createDatabase();
		return getMySQLInstance();
	}

	// Return connection
	return $conn;
}

?>