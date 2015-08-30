<?php
	include("secret.php");

	$userId = "1061837253";

	if (isset($_POST["maxId"]))
	{
		$maxId = $_POST["maxId"];
		$url = "https://api.instagram.com/v1/users/" . $userId ."/media/recent?access_token=" . $accessToken . "&max_id=" . $maxId;
		$resp = file_get_contents($url);
    	$encodedResp = json_encode($resp);
    	echo $encodedResp;
	} else {
		$url = "https://api.instagram.com/v1/users/" . $userId ."/media/recent?access_token=" . $accessToken;
    	$resp = file_get_contents($url);
    	$encodedResp = json_encode($resp);
    	echo $encodedResp;
	}
?>