(function() {
    var app = angular.module('instaAnalyzeApp');

    var instagramService = ['$q', '$log', '$http', function($q, log, $http) {
        var getUserData = function(userName) {
            return $http({
                    url: 'https://igpi.ga/' + userName + '/?__a=1',
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).
                success(function(data, status, headers, config) {
                    return data;
                }).
                error(function(data, status, headers, config) {
                    log.error('getUserData fail');
                });
        };

        var getUserDataWithMaxId = function(userName, nextMaxId) {
            return $http({
                    url: 'https://igpi.ga/' + userName + '/?__a=1&max_id=' + nextMaxId,
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).
                success(function(data, status, headers, config) {
                    return data;
                }).
                error(function(data, status, headers, config) {
                    log.error('getUserDataWithMaxId fail');
                });
        };

        return {
            getUserData: function(userName) {
                return getUserData(userName);
            },
            getUserDataWithMaxId: function(userName, nextMaxId) {
                return getUserDataWithMaxId(userName, nextMaxId);
            }
        };
    }];

    app.service('instagramService', instagramService);
}());