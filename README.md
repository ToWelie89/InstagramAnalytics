# InstagramAnalytics

Demo: http://martinsonesson.se/instagramanalytics/

## How to run locally

1. Clone the repo
2. Run
```
npm install
```
3. Run
```
grunt
```
4. Check the folder "model". In here you must create a file called secret.php. In it paste the code:

```
<?php
    $accessToken = "<your access token that you generate using Instagram API, check their docs>";
?>
```

The file instagramService.php in the model-folder contains the calls to Instagrams API for fetching data. Since php is used you may need software like WAMP/LAMP server to run locally.
