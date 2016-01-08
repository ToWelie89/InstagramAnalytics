<?php
	// The file secret.php is included in .gitignore so it is not uploaded to the Git repository
	// This file only contains one variable, $accessToken
	// If you clone this repo you need to create the secret.php file and generate your own accessToken variable
	// See: https://www.instagram.com/developer/authentication/
	include("secret.php");

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
		else if ($_POST["action"] == "getUserInformation")
		{
			$userId = $_POST["userId"];
			$url = "https://api.instagram.com/v1/users/" . $userId . "?access_token=" . $accessToken;
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