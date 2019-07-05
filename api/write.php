<?php

include 'main.php';

// Content will be JSON
header('Content-type: application/json');

// Checks if string is JSON
function isJson($string) {
	json_decode($string);
	return (json_last_error() == JSON_ERROR_NONE);
}

// Checks if params exist
foreach (["data", "password"] as $param)
{
	// If data param doesn't exist, fail
	if (!array_key_exists($param, $_POST))
	{
		die(json_encode([
			"error" => "$param POST parameter was not set!"
		]));
	}
}

// If the password is correct
if ($_POST["password"] != "password") {
	die(json_encode([
		"error" => "Password is incorrect!"
	]));
}

// Gets the new table to write
$newTable = $_POST["data"];

// If it is not JSON, throw error
if (!isJson($newTable)) {
	die(json_encode([
		"error" => "data POST parameter was not valid JSON"
	]));
} else {
	// Writes and return success if successful
	if (addData($newTable))
		echo json_encode("success");
}

?>