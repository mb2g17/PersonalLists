<?php

include 'main.php';

// Content will be JSON
header('Content-type: application/json');

// Checks if params exist
foreach (["password"] as $param)
{
	// If data param doesn't exist, fail
	if (!array_key_exists($param, $_POST))
	{
		die(json_encode([
			"error" => "$param POST parameter was not set!"
		]));
	}
}

// If the password is incorrect, throw error
if ($_POST["password"] != "password") {
	die(json_encode([
		"error" => "Password is incorrect!"
	]));
}

// Clears data
clearData();

// Return success
echo json_encode("success");

?>