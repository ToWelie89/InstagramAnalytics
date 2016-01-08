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