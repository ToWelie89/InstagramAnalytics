(function() {
    var app = angular.module("instaAnalyzeApp");

    var mainController = ['$scope', '$log', 'instagramService', function($scope, log, instagramService) {
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

        var filterDb = {};
        var filterList = [];

        var myNewChart;
        var filterChart;

        var ctx1;
        var ctx2;

        function init() {
            ctx1 = document.getElementById('imageVideoChart').getContext('2d');
            ctx2 = document.getElementById('filterChart').getContext('2d');

            myNewChart = new Chart(ctx1).Pie();
            filterChart = new Chart(ctx2).Pie();
        };

        function getInitialFlowForUser() {
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

                if (filterDb.hasOwnProperty(jsonResp.data[i].filter)) {
                    filterDb[jsonResp.data[i].filter]++;
                } else {
                    filterDb[jsonResp.data[i].filter] = 1;
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

        function getColor(c,n,i,d){
            for(i=3;i--;c[i]=d<0?0:d>255?255:d|0)d=c[i]+n;return c
        };

        function setupChart() {
            myNewChart.destroy();
            filterChart.destroy();

            var data = [{
                value: numberOfImages,
                color: '#F7464A',
                highlight: '#FF5A5E',
                label: 'Images'
            }, {
                value: numberOfVideos,
                color: '#46BFBD',
                highlight: '#5AD3D1',
                label: 'Videos'
            }];

            filterList = [];
            for (var filter in filterDb) {
                if (filterDb.hasOwnProperty(filter)) {
                    var r = Math.floor((Math.random() * 255) + 10);
                    var g = Math.floor((Math.random() * 255) + 10);
                    var b = Math.floor((Math.random() * 255) + 10);

                    var color = getColor([r, g, b], 0);
                    var highlightColor = getColor([r, g, b], -20);

                    r = color[0].toString(16);
                    g = color[1].toString(16);
                    b = color[2].toString(16);

                    r = (r.length === 1) ? ("0" + r) : r;
                    g = (g.length === 1) ? ("0" + g) : g;
                    b = (b.length === 1) ? ("0" + b) : b;

                    var newColor = "#" + r + g + b;

                    r = highlightColor[0].toString(16);
                    g = highlightColor[1].toString(16);
                    b = highlightColor[2].toString(16);

                    r = (r.length === 1) ? ("0" + r) : r;
                    g = (g.length === 1) ? ("0" + g) : g;
                    b = (b.length === 1) ? ("0" + b) : b;

                    var newHighLightColor = "#" + r + g + b;

                    filterList.push({
                        value: filterDb[filter],
                        color: newColor,
                        highlight: newHighLightColor,
                        label: filter
                    });
                }
            }

            myNewChart = new Chart(ctx1).Pie(data);
            filterChart = new Chart(ctx2).Pie(filterList);
        };

        function convertDbToList() {
            // Tags
            var tagdbAsList = [];
            for (var tag in tagdb) {
                if (tagdb.hasOwnProperty(tag)) {
                    tagdbAsList.push({
                        name: tag,
                        value: tagdb[tag]
                    });
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
            filterList = [];

            numberOfVideos = 0;
            numberOfImages = 0;

            var promise = instagramService.searchForUser(query);

            var successCallback = function(response) {
                $scope.noUserFound = false;

                var encodedResponse = JSON.parse(response.data);
                var encodedResponse = JSON.parse(encodedResponse);
                log.debug(encodedResponse);

                if (encodedResponse.data.length === 0) {
                    $scope.noUserFound = true;
                    $scope.loading = false;
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
                        $scope.loading = false;
                    }
                }
            };

            var errorCallback = function() {
                log.error(':(');
            };

            return promise.then(successCallback, errorCallback);
        };

        $scope.search = function() {
            $scope.loading = true;
            searchForUser($scope.searchQuery);
        };

        function fullFlowListSort(a, b) {
            return (b.value - a.value)
        };

        function imageListSort(a, b) {
            return (b.count - a.count)
        };

        init();
    }];

    app.controller("mainController", mainController);
}());