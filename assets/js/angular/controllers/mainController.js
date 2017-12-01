export default class GameController {
    constructor($scope, $timeout, instagramService) {
        this.vm = this;

        this.vm.loading = false;
        this.vm.noUserFound = true;
        this.vm.searchHasBeenTriggered = false;
        this.vm.username = '';
        this.vm.imagedb = [];
        this.vm.userInformation = {};
        this.vm.likesListLimit = 5;
        this.vm.commentsListLimit = 5;
        this.vm.progress = 0;

        this.numberOfVideos = 0;
        this.numberOfImages = 0;
        this.numberOfGalleries = 0;

        this.myNewChart;
        this.ctx1;

        // PUBLIC FUNCTIONS
        this.vm.search = this.search;

        this.$timeout = $timeout;
        this.instagramService = instagramService;
    }

    getParsedData(data) {
        var encodedResponse = data;
        return encodedResponse;
    }

    getInitialFlowForUser(username) {
        var promise = this.instagramService.getUserData(username);

        var successCallback = function(response) {
            this.vm.noUserFound = false;
            var encodedResponse = this.getParsedData(response.data);
            console.log(encodedResponse);

            if (encodedResponse.user) {

                this.vm.userIsPrivate = encodedResponse.user.is_private;

                this.vm.userInformation.profile_picture = encodedResponse.user.profile_pic_url;
                this.vm.userInformation.full_name = encodedResponse.user.full_name;
                this.vm.userInformation.bio = encodedResponse.user.biography;
                this.vm.userInformation.website = encodedResponse.user.external_url;
                this.vm.userInformation.follows = encodedResponse.user.follows.count;
                this.vm.userInformation.followed_by = encodedResponse.user.followed_by.count;
                this.vm.userInformation.contentCount = encodedResponse.user.media.count;
                console.log(this.vm.userInformation);

                if (encodedResponse.user.media.count > 0 && !this.vm.userIsPrivate) {
                    this.addToFlow(encodedResponse);
                } else {
                    this.vm.progress = 100;

                    this.$timeout(function () {
                        this.vm.loading = false;
                    }, 500);
                }
            } else {
                this.vm.loading = false;
                this.vm.noUserFound = true;
            }
        };

        var errorCallback = function() {
            console.error(':(');
            this.vm.loading = false;
            this.vm.noUserFound = true;
        };

        return promise.then(successCallback, errorCallback);
    }

    getNextPage(nextMaxId) {
        var promise = this.instagramService.getUserDataWithMaxId(this.vm.username, nextMaxId);

        var successCallback = function(response) {
            var encodedResponse = getParsedData(response.data);
            console.log(encodedResponse);
            this.addToFlow(encodedResponse);
        };

        var errorCallback = function() {
            this.vm.loading = false;
            this.vm.error = true;
            console.error(':(');
        };

        return promise.then(successCallback, errorCallback);
    };

    addToFlow(jsonResp) {
        var data = jsonResp.user.media.nodes;
        for (var i = 0; i < data.length; i++) {
            this.vm.imagedb.push({
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

            this.vm.progress = Math.ceil(this.vm.imagedb.length * 100 / this.vm.userInformation.contentCount);
        }

        if (jsonResp.user.media.page_info && jsonResp.user.media.page_info.has_next_page) {
            this.getNextPage(jsonResp.user.media.page_info.end_cursor);
        } else {
            //this.vm.imagedb.sort(imageListSort);
            console.log(this.vm.imagedb);
            this.vm.loading = false;
            setTimeout(this.setupChart, 500);
        }
    };

    getColor(c,n,i,d){
        for(i=3;i--;c[i]=d<0?0:d>255?255:d|0)d=c[i]+n;return c
    };

    setupChart() {
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

    clearPreviousData() {
        this.vm.imagedb = [];
        this.vm.userInformation = {};
        this.vm.likesListLimit = 5;
        this.vm.commentsListLimit = 5;
        this.vm.progress = 0;
        this.vm.error = false;
    }

    search() {
        this.vm.searchHasBeenTriggered = true;
        this.vm.loading = true;
        this.vm.error = false;
        this.clearPreviousData();
        this.getInitialFlowForUser(this.vm.username.toLowerCase());
    };
};