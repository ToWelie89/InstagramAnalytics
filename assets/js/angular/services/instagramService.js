
export default class MapService {
    constructor($http) {
        this.$http = $http;
    }

    getUserData(userName) {
        return this.$http({
                url: 'https://instagramanalytics.herokuapp.com/' + userName + '/?__a=1',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).
            success(function(data, status, headers, config) {
                return data;
            }).
            error(function(data, status, headers, config) {
                console.error('getUserData fail');
            });
    };

    getUserDataWithMaxId(userName, nextMaxId) {
        return this.$http({
                url: 'https://instagramanalytics.herokuapp.com/' + userName + '/?__a=1&max_id=' + nextMaxId,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).
            success(function(data, status, headers, config) {
                return data;
            }).
            error(function(data, status, headers, config) {
                console.error('getUserDataWithMaxId fail');
            });
    };
}