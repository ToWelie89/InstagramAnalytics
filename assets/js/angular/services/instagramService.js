export default class InstagramService {
    constructor() {
    }

    getUserData(userName) {
        return fetch(`https://instagramanalytics.herokuapp.com/${userName}/?__a=1`)
        .then((resp) => resp.json())
        .then(data => {
            console.log(data);
            return data;
        })
        .catch(err => {
            console.error(`getUserData failed for username ${userName}`, err);
            return null;
        });
    };

    getUserDataWithMaxId(userName, nextMaxId) {
        return fetch(`https://instagramanalytics.herokuapp.com/${userName}/?__a=1&max_id=${nextMaxId}`)
        .then((resp) => resp.json())
        .then(data => {
            return data;
        })
        .catch(err => {
            console.error(`getUserDataWithMaxId failed for username ${userName} and max id ${nextMaxId}`, err);
            return null;
        });
    };

    getPostData(postCode) {
        return fetch(`https://instagramanalytics.herokuapp.com/p/${postCode}/?__a=1`)
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
        return fetch(`https://instagramanalytics.herokuapp.com/explore/locations/${locationId}/?__a=1`)
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