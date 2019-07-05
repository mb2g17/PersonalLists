<?php

include 'main.php';

// Makes output JSON
header('Content-type: application/json; charset=UTF-8');

// Outputs data
echo json_encode(getData());

?>