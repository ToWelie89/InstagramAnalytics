app.service('instagramService', ['$q', '$log', '$http', function($q, log, $http) {

    var getInitialSelfFlow = function() {
        return $http.get('./model/instagramService.php').
            success(function(data, status, headers, config) {
                return data;
            }).
            error(function(data, status, headers, config) {
                log.error('getInitialSelfFlow fail');
            });
    };

    var getSelfFlowWithMaxId = function(maxId) {
        return $http({
                url: './model/instagramService.php',
                method: "POST",
                data: $.param({
                    maxId: maxId
                }),
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).
            success(function(data, status, headers, config) {
                return data;
            }).
            error(function(data, status, headers, config) {
                log.error('getSelfFlowWithMaxId fail');
            });
    };

    return {
        getInitialSelfFlow: function() {
            return getInitialSelfFlow();
        },
        getSelfFlowWithMaxId: function(maxId) {
            return getSelfFlowWithMaxId(maxId);
        }
    };
}]);