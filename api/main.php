<?php

// Stops error reporting
error_reporting(E_ERROR | E_PARSE);

include "sql.php";

/**
 * Creates the database and table
 */
function createDatabase()
{
	// Creates connection
	$conn = getGlobalMySQLInstance();

	// Tries to create database and table
	$conn->query("CREATE DATABASE lists");
	$conn->query("CREATE TABLE lists.lists (
		id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	    data LONGTEXT
	)");
}

/**
 * Fetches all data
 */
function getData()
{
	// Gets MySQL instance
	$conn = getMySQLInstance();

	// Does SQL query
	$result = $conn->query("SELECT data FROM `lists`");

	// If error, state error
	if (!$result) {
		trigger_error('Invalid query: ' . $conn->error);
	}

	// Creates an array to fill in
	$data = [];

	// Goes through each row
	while($row = $result->fetch_assoc()) {
		$data[] = json_decode($row["data"]);
	}

	// Closes connection
	$conn->close();

	// Return data
	return $data;
}

/**
 * Clears all data
 */
function clearData()
{
	// Gets global MySQL instance
	$conn = getGlobalMySQLInstance();

	// Does SQL query
	$result = $conn->query("DROP DATABASE `lists`");

	// If error, state error
	if (!$result)
		trigger_error("Couldn't clear data: " . $conn->error);

	// Closes connection
	$conn->close();
}

/**
 * Adds new list
 * @param data - the json string to add to the db
 * @return true if success, false if not
 */
function addData($data)
{
	// Gets MySQL instance
	$conn = getMySQLInstance();

	// Does SQL query
	$result = $conn->query("INSERT INTO lists (data) VALUES (\"" . addslashes($data) . "\")");

	// If error, state error
	if (!$result) {
		echo json_encode(["error" => "Couldn't clear data: " . $conn->error]);
		return false;
	}

	// Closes connection
	$conn->close();

	// Return success
	return true;
}

?>