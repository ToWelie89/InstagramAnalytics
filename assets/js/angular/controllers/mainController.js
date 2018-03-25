import {DateFilter} from './../filters/dateFilter';

export default class MainController {
    constructor($scope, $timeout, $q, instagramService) {
        this.vm = this;

        this.vm.loading = false;
        this.vm.noUserFound = true;
        this.vm.searchHasBeenTriggered = false;
        this.vm.username = '';
        this.vm.imagedb = [];
        this.vm.userInformation = {};
        this.vm.progress = 0;

        this.vm.listLimit = 5;
        this.vm.currentSorting = 'likes';
        this.vm.sortReverse = true;

        this.vm.postsWithLocations = [];

        this.numberOfVideos = 0;
        this.numberOfImages = 0;
        this.numberOfGalleries = 0;

        this.myNewChart;
        this.ctx1;
        this.map;
        window.locationContents = {};

        // PUBLIC FUNCTIONS
        this.vm.search = this.search;
        this.vm.showMore = this.showMore;
        this.vm.showLess = this.showLess;

        this.$timeout = $timeout;
        this.instagramService = instagramService;
        this.$q = $q;
        this.$scope = $scope;

        fetch('./package.json')
        .then((resp) => resp.json())
        .then((data) => {
            this.vm.version = data.version;
            $scope.$apply();
        });
    }

    getInitialFlowForUser(username) {
        return this.instagramService.getUserData(username)
        .then(response => {
            this.vm.noUserFound = false;
            console.log(response);

            if (response.graphql.user) {

                this.vm.userIsPrivate = response.graphql.user.is_private;

                this.vm.userInformation.profile_picture = response.graphql.user.profile_pic_url;
                this.vm.userInformation.full_name = response.graphql.user.full_name;
                this.vm.userInformation.bio = response.graphql.user.biography;
                this.vm.userInformation.website = response.graphql.user.external_url;
                this.vm.userInformation.follows = response.graphql.user.follows.count;
                this.vm.userInformation.followed_by = response.graphql.user.followed_by.count;
                this.vm.userInformation.contentCount = response.graphql.user.media.count;
                console.log(this.vm.userInformation);

                if (response.graphql.user.media.count > 0 && !this.vm.userIsPrivate) {
                    this.getAllLocations(response.graphql.user.media.nodes).then(() => {
                        this.addToFlow(response);
                    });
                } else {
                    this.vm.progress = 100;
                    this.$scope.$apply();

                    setTimeout(() => {
                        this.vm.loading = false;
                        this.$scope.$apply();
                    }, 500);
                }
            } else {
                this.vm.loading = false;
                this.vm.noUserFound = true;
                this.$scope.$apply();
            }
        })
        .catch(() => {
            console.error(':(');
            this.vm.loading = false;
            this.vm.noUserFound = true;
        });
    }

    getAllLocations(nodes) {
        const promises = [];
        nodes.forEach(node => {
            const promise = this.instagramService.getPostData(node.code)
                            .then(res => {

                                if (res.graphql.shortcode_media.taken_at_timestamp) {
                                    node.timestamp = res.graphql.shortcode_media.taken_at_timestamp;
                                    node.isAd = res.graphql.shortcode_media.is_ad;
                                }

                                const location = res.graphql.shortcode_media.location;
                                if (location) {
                                    return this.instagramService.getLocation(res.graphql.shortcode_media.location.id);
                                } else {
                                    return null;
                                }
                            })
                            .then(res => {
                                if (res) {
                                    node.location = res.location;
                                }
                            });
            promises.push(promise);
        });
        return Promise.all(promises);
    }

    getNextPage(nextMaxId) {
        this.instagramService.getUserDataWithMaxId(this.vm.username, nextMaxId)
        .then(response => {
            console.log(response);
            this.getAllLocations(response.graphql.user.media.nodes).then(() => {
                this.addToFlow(response);
            });
        })
        .catch(() => {
            this.vm.loading = false;
            this.vm.error = true;
            console.error(':(');
        });
    };

    addToFlow(jsonResp) {
        var data = jsonResp.user.media.nodes;
        for (var i = 0; i < data.length; i++) {
            this.vm.imagedb.push({
                id: data[i].id,
                likes: data[i].likes.count,
                comments: data[i].comments.count,
                thumbnail: data[i].thumbnail_src,
                link: 'https://www.instagram.com/p/' + data[i].code,
                location: data[i].location ? data[i].location : null,
                timestamp: data[i].timestamp ? data[i].timestamp : null,
                isAd: data[i].isAd,
                type: data[i].__typename
            });

            if (data[i].__typename === 'GraphImage') {
                this.numberOfImages++;
            } else if (data[i].__typename === 'GraphVideo') {
                this.numberOfVideos++;
            } else if (data[i].__typename === 'GraphSidecar') {
                this.numberOfGalleries++;
            }

            this.vm.progress = Math.ceil(this.vm.imagedb.length * 100 / this.vm.userInformation.contentCount);
            this.$scope.$apply();
        }

        if (jsonResp.user.media.page_info && jsonResp.user.media.page_info.has_next_page) {
            this.getNextPage(jsonResp.user.media.page_info.end_cursor);
        } else {
            console.log('Complete list', this.vm.imagedb);
            this.vm.progress = 100;
            this.$scope.$apply();

            this.vm.postsWithLocations = this.vm.imagedb.filter(x => x.location);
            this.vm.postsWithLocationsAmount = this.vm.postsWithLocations.length;
            this.$scope.$apply();

            setTimeout(() => {
                this.vm.loading = false;
                this.$scope.$apply();
                this.setChart();
                this.setMap();
            }, 500);
        }
    };

    setMap() {
        this.map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 43.769562, lng: 11.255814},
          zoom: 2
        });

        let index = 0;
        this.vm.postsWithLocations.forEach(x => {
            this.dropMarker(x, index * 50);
            index++;
        });
    }

    dropMarker(post, delay) {
        setTimeout(() => {
            window.locationContents[post.id] = new google.maps.InfoWindow({
                content: `
                          <div id="content">
                              <div id="siteNotice">
                              </div>
                              <h3 id="firstHeading" class="firstHeading">${post.location.name}</h3>
                              <div id="bodyContent">
                                  <div style="float:left;">
                                      <a href="${post.link}" target="_blank">
                                        <img src="${post.thumbnail}" width="100" height="100" alt="" style="border-radius: 10px;" />
                                      </a>
                                  </div>
                                  <div style="float:left; padding: 15px; font-size: 16px;">
                                      ${DateFilter()(post.timestamp)} <br>
                                      ${post.likes} <span class="glyphicon glyphicon-heart" style="color: red;"></span><br>
                                      ${post.comments} <span class="glyphicon glyphicon-comment" style="color: #a8a84b;"></span>
                                  </div>
                              </div>
                          </div>
                          `
            });

            let marker = new google.maps.Marker({
              position: {lat: post.location.lat, lng: post.location.lng},
              map: this.map,
              title: post.location.name,
              animation: google.maps.Animation.DROP,
              id: post.id
            });

            marker.addListener('click', function() {
                window.locationContents[marker.id].open(this.map, marker);
            });
        }, delay);
    }

    setChart() {
        if (this.myNewChart) {
            this.myNewChart.destroy();
        }
        var data = {
            labels: ['Images', 'Videos', 'Galleries'],
            datasets: [{
                data: [this.numberOfImages, this.numberOfVideos, this.numberOfGalleries],
                backgroundColor: [
                    '#FF5A5E',
                    '#5AD3D1',
                    '#58ef40'
                ],
                borderColor: [
                    '#F7464A',
                    '#46BFBD',
                    '#44cc2e'
                ],
                borderWidth: 1
            }]
        }
        this.ctx1 = document.getElementById('imageVideoChart').getContext('2d');
        this.myNewChart = new Chart(this.ctx1, {
            type: 'pie',
            data: data,
            options: {
                 legend: {
                    display: false
                 }
            }
        });
    }

    clearPreviousData() {
        this.vm.imagedb = [];
        this.vm.userInformation = {};
        this.vm.listLimit = 5;
        this.vm.currentSorting = 'likes';
        this.vm.sortReverse = true;
        this.vm.progress = 0;
        this.vm.error = false;
        this.vm.postsWithLocations = [];
    }

    search() {
        this.vm.searchHasBeenTriggered = true;
        this.vm.loading = true;
        this.vm.error = false;
        this.clearPreviousData();
        this.getInitialFlowForUser(this.vm.username.toLowerCase());
    };

    showMore() {
        if (this.listLimit < this.imagedb.length) {
            this.listLimit += 5;
        }
    }

    showLess() {
        if (this.listLimit > 5) {
            this.listLimit -= 5;
        }
    }
};