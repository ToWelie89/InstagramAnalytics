app.controller('mainController', ['$scope', '$log', 'instagramService', function($scope, log, instagramService) {
	$scope.fullFlowList = [];
    $scope.loading = false;
    $scope.noUserFound = false;
    $scope.searchQuery = '';
    var tagdb = {};
    $scope.imagedb = [];
    $scope.userId = '';
    $scope.userInformation;

    var numberOfVideos = 0;
    var numberOfImages = 0;

    function init() {

    };

    function getInitialFlowForUser() {
        $scope.loading = true;
        var promise = instagramService.getInitialSelfFlow($scope.userId);

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
        var promise = instagramService.getSelfFlowWithMaxId($scope.userId, nextMaxId);

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

            $scope.imagedb.push({
                id: jsonResp.data[i].id,
                count: jsonResp.data[i].likes.count,
                thumbnail: jsonResp.data[i].images.thumbnail.url,
                link: jsonResp.data[i].link
            });

            if (jsonResp.data[i].type === 'image') {
                numberOfImages++;
            } else {
                numberOfVideos++;    
            }
        }

        if (jsonResp.pagination.next_url && jsonResp.pagination.next_max_id) {
            getNextPage(jsonResp.pagination.next_max_id);
        } else {
            getUserInformation($scope.userId);
            convertDbToList();
            setTimeout(setupChart, 500);
        }
    };

    function setupChart() {
        var data = [
            {
                value: numberOfImages,
                color:"#F7464A",
                highlight: "#FF5A5E",
                label: "Images"
            },
            {
                value: numberOfVideos,
                color: "#46BFBD",
                highlight: "#5AD3D1",
                label: "Videos"
            }
        ];

        var ctx = document.getElementById("myChart").getContext("2d");
        var myNewChart = new Chart(ctx).Pie(data, {
            scaleBackdropPaddingY : 0,
            scaleBackdropPaddingX : 0,
            percentageInnerCutout : 0
        });
    };

    function convertDbToList() {
        // Tags
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

        // Likes
        $scope.imagedb.sort(imageListSort);
        log.debug($scope.imagedb);

        $scope.loading = false;
    };

    function getUserInformation(userId) {
        var promise = instagramService.getUserInformation(userId);

        var successCallback = function(response) {
            var encodedResponse = JSON.parse(response.data);
            var encodedResponse = JSON.parse(encodedResponse);
            log.debug(encodedResponse);

            $scope.userInformation = encodedResponse.data;
        };

        var errorCallback = function() {
            log.error(':(');
        };

        return promise.then(successCallback, errorCallback);
    };

    function searchForUser(query) {
        tagdb = new Object();
        $scope.imagedb = [];
        $scope.fullFlowList = [];

        numberOfVideos = 0;
        numberOfImages = 0;

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
                        $scope.userId = encodedResponse.data[i].id;
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

    function imageListSort(a, b) {
        return (b.count - a.count)
    };

    init();
}]);