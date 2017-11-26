(function() {
    var app = angular.module('instaAnalyzeApp');

    var mainController = ['$scope', '$timeout', '$log', 'instagramService', 'colorService', function($scope, $timeout, log, instagramService, colorService) {
        $scope.loading = false;
        $scope.noUserFound = true;
        $scope.searchHasBeenTriggered = false;
        $scope.username = '';
        $scope.imagedb = [];
        $scope.userInformation = {};
        $scope.likesListLimit = 5;
        $scope.commentsListLimit = 5;
        $scope.progress = 0;

        var numberOfVideos = 0;
        var numberOfImages = 0;
        var numberOfGalleries = 0;

        var myNewChart;
        var ctx1;

        // PUBLIC FUNCTIONS
        $scope.search = search;

        function getParsedData(data) {
            var encodedResponse = data;
            return encodedResponse;
        }

        function getInitialFlowForUser(username) {
            var promise = instagramService.getUserData(username);

            var successCallback = function(response) {
                $scope.noUserFound = false;
                var encodedResponse = getParsedData(response.data);
                console.log(encodedResponse);

                if (encodedResponse.user) {

                    $scope.userIsPrivate = encodedResponse.user.is_private;

                    $scope.userInformation.profile_picture = encodedResponse.user.profile_pic_url;
                    $scope.userInformation.full_name = encodedResponse.user.full_name;
                    $scope.userInformation.bio = encodedResponse.user.biography;
                    $scope.userInformation.website = encodedResponse.user.external_url;
                    $scope.userInformation.follows = encodedResponse.user.follows.count;
                    $scope.userInformation.followed_by = encodedResponse.user.followed_by.count;
                    $scope.userInformation.contentCount = encodedResponse.user.media.count;
                    console.log($scope.userInformation);

                    if (encodedResponse.user.media.count > 0 && !$scope.userIsPrivate) {
                        addToFlow(encodedResponse);
                    } else {
                        $scope.progress = 100;

                        $timeout(function () {
                            $scope.loading = false;
                        }, 500);
                    }
                } else {
                    $scope.loading = false;
                    $scope.noUserFound = true;
                }
            };

            var errorCallback = function() {
                log.error(':(');
                $scope.loading = false;
                $scope.noUserFound = true;
            };

            return promise.then(successCallback, errorCallback);
        }

        function getNextPage(nextMaxId) {
            var promise = instagramService.getUserDataWithMaxId($scope.username, nextMaxId);

            var successCallback = function(response) {
                var encodedResponse = getParsedData(response.data);
                console.log(encodedResponse);
                addToFlow(encodedResponse);
            };

            var errorCallback = function() {
                $scope.loading = false;
                $scope.error = true;
                log.error(':(');
            };

            return promise.then(successCallback, errorCallback);
        };

        function addToFlow(jsonResp) {
            var data = jsonResp.user.media.nodes;
            for (var i = 0; i < data.length; i++) {
                $scope.imagedb.push({
                    id: data[i].id,
                    likes: data[i].likes.count,
                    comments: data[i].comments.count,
                    thumbnail: data[i].thumbnail_src,
                    link: 'https://www.instagram.com/p/' + data[i].code
                });

                if (data[i].__typename === 'GraphImage') {
                    numberOfImages++;
                } else if (data[i].__typename === 'GraphVideo') {
                    numberOfVideos++;
                } else if (data[i].__typename === 'GraphSidecar') {
                    numberOfGalleries++;
                }

                $scope.progress = Math.ceil($scope.imagedb.length * 100 / $scope.userInformation.contentCount);
            }

            if (jsonResp.user.media.page_info && jsonResp.user.media.page_info.has_next_page) {
                getNextPage(jsonResp.user.media.page_info.end_cursor);
            } else {
                //$scope.imagedb.sort(imageListSort);
                console.log($scope.imagedb);
                $scope.loading = false;
                setTimeout(setupChart, 500);
            }
        };

        function getColor(c,n,i,d){
            for(i=3;i--;c[i]=d<0?0:d>255?255:d|0)d=c[i]+n;return c
        };

        function setupChart() {
            if (myNewChart) {
                myNewChart.destroy();
            }
            var data = {
                labels: ['Images', 'Videos', 'Galleries'],
                datasets: [{
                    data: [numberOfImages, numberOfVideos, numberOfGalleries],
                    backgroundColor: [
                        '#FF5A5E',
                        '#5AD3D1',
                        '#ff5b91'
                    ],
                    borderColor: [
                        '#F7464A',
                        '#46BFBD',
                        '#f4427d'
                    ],
                    borderWidth: 1
                }]
            }
            ctx1 = document.getElementById('imageVideoChart').getContext('2d');
            var myNewChart = new Chart(ctx1, {
                type: 'pie',
                data: data,
                options: {
                     legend: {
                        display: false
                     }
                }
            });
        };

        function clearPreviousData() {
            $scope.imagedb = [];
            $scope.userInformation = {};
            $scope.likesListLimit = 5;
            $scope.commentsListLimit = 5;
            $scope.progress = 0;
            $scope.error = false;
        }

        function search() {
            $scope.searchHasBeenTriggered = true;
            $scope.loading = true;
            $scope.error = false;
            clearPreviousData();
            getInitialFlowForUser($scope.username.toLowerCase());
        };
    }];

    app.controller('mainController', mainController);
}());