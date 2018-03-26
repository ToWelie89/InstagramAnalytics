export default class InstagramService {
    constructor() {
    }

    getUserData(userName) {
        return fetch(`https://instagramanalyze.herokuapp.com/${userName}/?__a=1`)
        .then((resp) => resp.json())
        .then(data => {
            return data;
        })
        .catch(err => {
            console.error(`getUserData failed for username ${userName}`, err);
            return null;
        });
    };

    getUserMedia(userName) {
        return fetch(`https://instagramanalyze.herokuapp.com/${userName}/media?count=15`)
        .then((resp) => resp.json())
        .then(data => {
            return data;
        })
        .catch(err => {
            console.error(`getUserMedia failed for username ${userName}`, err);
            return null;
        });
    };

    getPostData(postCode) {
        return fetch(`https://instagramanalyze.herokuapp.com/p/${postCode}/?__a=1`)
        .then((resp) => resp.json())
        .then(data => {
            return data;
        })
        .catch(err => {
            console.error(`getPostData failed for post code ${postCode}`, err);
            return null;
        });
    };

    getLocation(locationId) {
        return fetch(`https://instagramanalyze.herokuapp.com/explore/locations/${locationId}/?__a=1`)
        .then((resp) => resp.json())
        .then(data => {
            return data;
        })
        .catch(err => {
            console.error(`getLocation failed for id ${locationId}`, err);
            return null;
        });
    };
}