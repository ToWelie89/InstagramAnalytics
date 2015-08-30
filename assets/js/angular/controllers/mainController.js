app.controller('mainController', ['$scope', '$log', 'instagramService', function($scope, log, instagramService) {
	$scope.fullFlowList = [];
    $scope.loading = false;
    $scope.noUserFound = false;
    $scope.searchQuery = '';
    var tagdb = {};
    var userId = '';

    function init() {
        
    };

    function getInitialFlowForUser() {
        $scope.loading = true;
        var promise = instagramService.getInitialSelfFlow(userId);

        var successCallback = function(response) {
            var encodedResponse = JSON.parse(response.data);
            var encodedResponse = JSON.parse(encodedResponse);
            log.debug(encodedResponse);
            addToFlow(encodedResponse);
        };

        var errorCallback = function() {
            log.error(':(');
        };

        return promise.then(successCallback, errorCallback);
    }

    function getNextPage(nextMaxId) {
        var promise = instagramService.getSelfFlowWithMaxId(userId, nextMaxId);

        var successCallback = function(response) {
            var encodedResponse = JSON.parse(response.data);
            var encodedResponse = JSON.parse(encodedResponse);
            log.debug(encodedResponse);
            addToFlow(encodedResponse);
        };

        var errorCallback = function() {
            log.error(':(');
        };

        return promise.then(successCallback, errorCallback);
    };

    function addToFlow(jsonResp) {
        for (var i = 0; i < jsonResp.data.length; i++) {
            for (var j = 0; j < jsonResp.data[i].tags.length; j++) {
                if (tagdb.hasOwnProperty(jsonResp.data[i].tags[j])) {
                    tagdb[jsonResp.data[i].tags[j]]++;
                } else {
                    tagdb[jsonResp.data[i].tags[j]] = 1;
                }
            }
        }

        if (jsonResp.pagination.next_url && jsonResp.pagination.next_max_id) {
            getNextPage(jsonResp.pagination.next_max_id);
        } else {
            convertDbToList();
        }
    };

    function convertDbToList() {
        var tagdbAsList = [];
        for (var tag in tagdb)
        {
            if (tagdb.hasOwnProperty(tag)) {
                tagdbAsList.push({ name: tag, value: tagdb[tag] });
            }
        }

        $scope.fullFlowList = $scope.fullFlowList.concat(tagdbAsList);
        $scope.fullFlowList.sort(fullFlowListSort);
        log.debug($scope.fullFlowList);
        $scope.loading = false;
    };

    function searchForUser(query) {
        tagdb = new Object();
        $scope.fullFlowList = [];
        var promise = instagramService.searchForUser(query);

        var successCallback = function(response) {
            $scope.noUserFound = false;

            var encodedResponse = JSON.parse(response.data);
            var encodedResponse = JSON.parse(encodedResponse);
            log.debug(encodedResponse);

            if (encodedResponse.data.length === 0)
            {
                $scope.noUserFound = true;
            } else {
                var found = false;
                for (var i = 0; i < encodedResponse.data.length; i++) {
                    if (encodedResponse.data[i].username === query) {
                        found = true;
                        userId = encodedResponse.data[i].id;
                        getInitialFlowForUser();
                    }
                }
                if (!found) {
                    $scope.noUserFound = true;
                }
            }
        };

        var errorCallback = function() {
            log.error(':(');
        };

        return promise.then(successCallback, errorCallback);
    };

    $scope.search = function() {
        searchForUser($scope.searchQuery);
    };

    function fullFlowListSort(a, b) {
        return (b.value - a.value)
    };

    init();
}]);