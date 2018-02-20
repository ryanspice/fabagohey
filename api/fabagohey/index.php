<?php


$con=mysqli_connect("localhost","rspice_admin","Spalds123","rspice_js");

// Check connection
if (mysqli_connect_errno())  {
	echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

// Perform queries
//mysqli_query($con,"SELECT * FROM  `fabagohey` LIMIT 10");


$client = $_GET['client'];
$Version = $_GET['version'];
$spicejs = $_GET['spicejs'];

$header = '{"client":"'.$client.'", "version":"'.$Version.'","spicejs":"'.$spicejs.'",';

$json = '"agent":"'.$_SERVER['HTTP_USER_AGENT'].'" ';
$json = $json.',"browser":"'.json_decode(get_browser(null, true), JSON_PRETTY_PRINT).'" ';

$footer = '}';

echo $header.$json.$footer;
mysqli_query($con, "INSERT INTO  `rspice_js`.`_track_client` (`id` ,`data` , `date`)VALUES (NULL ,  '".$header.$json.$footer."',CURRENT_TIMESTAMP)");

mysqli_close($con);
?>
