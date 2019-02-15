
**DO NOTE:** The Instagram API that this project relied on has been terminated because Instagram have implemented lots of restrictions on who can access their data, which means this project is useless from now on.

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
4. Start a local server by running
```
npm start
```

You should now be able to demo the application by visiting http://localhost:8080

## The API

At the moment this application does NOT communicate with the official Instagram API due to limitations introduced to the API recently. Instead I am using a third part API, namely [this one](https://github.com/whizzzkid/instagram-proxy-api).
