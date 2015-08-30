<?php
	include("secret.php");

	$userId = "1061837253";

	if (isset($_POST["action"]))
	{
		if ($_POST["action"] == "search")
		{
			$query = $_POST["query"];
			$url = "https://api.instagram.com/v1/users/search?q=" . $query ."&access_token=" . $accessToken;
			$resp = file_get_contents($url);
	    	$encodedResp = json_encode($resp);
	    	echo $encodedResp;
		}
	}
	else if (isset($_POST["maxId"]))
	{
		$userId = $_POST["userId"];
		$maxId = $_POST["maxId"];
		$url = "https://api.instagram.com/v1/users/" . $userId ."/media/recent?access_token=" . $accessToken . "&max_id=" . $maxId;
		$resp = file_get_contents($url);
    	$encodedResp = json_encode($resp);
    	echo $encodedResp;
	} else {
		$userId = $_POST["userId"];
		$url = "https://api.instagram.com/v1/users/" . $userId ."/media/recent?access_token=" . $accessToken;
    	$resp = file_get_contents($url);
    	$encodedResp = json_encode($resp);
    	echo $encodedResp;
	}
?>