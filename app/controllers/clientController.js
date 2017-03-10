'use strict';

app.controller('homeController', function($scope, $resource, $location, youtubeFactory, userService) {
    $scope.items = [];
    $scope.nextPageToken = null;
    $scope.prevPageToken = null;
    $scope.btnStatus = 'disabled';
    $scope.pageBtns = true;
    var authApi = $resource('/auth/isLoggedIn');
    $scope.isAuthenticated = function() {
        authApi.get({}, function(user) {
            if (!user.username) {
                $location.path('/');
            }
        }, function(err) {
            if (err) {
                $location.path('/');
            }
        });
    };

    $scope.isAuthenticated();
    
    $scope.keyPress = function(keyCode) {
        if(keyCode == 13) {
            $scope.searchClicked();
        }
    };
    
    $scope.searchClicked = function() {
        youtubeFactory.getVideosFromSearchByParams({
            q: $scope.videoDesc,
            key: 'AIzaSyBZ25cluRZvaImGXPsdQor2X9u-ZVTpyAk',
            order: 'relevance'
        }).then(function(data) {
            //videoService.setVideoId(data.data.items[0].id.videoId);
            $scope.items = data.data.items;
            if ($scope.items) {
                $scope.pageBtns = false;
            }
            $scope.nextPageToken = data.data.nextPageToken;
            console.info('videos from search by query', data);
        });
    };

    $scope.nextPage = function() {
        youtubeFactory.getVideosFromSearchByParams({
            q: $scope.videoDesc,
            key: 'AIzaSyBZ25cluRZvaImGXPsdQor2X9u-ZVTpyAk',
            order: 'relevance',
            nextPageToken: $scope.nextPageToken
        }).then(function(data) {
            //videoService.setVideoId(data.data.items[0].id.videoId);
            $scope.items = data.data.items;
            if ($scope.items) {
                $scope.btnStatus = null;
            }
            $scope.prevPageToken = $scope.nextPageToken;
            $scope.nextPageToken = data.data.nextPageToken;
            console.info('videos from search by query', data);
        });
    };

    $scope.prevPage = function() {
        youtubeFactory.getVideosFromSearchByParams({
            q: $scope.videoDesc,
            key: 'AIzaSyBZ25cluRZvaImGXPsdQor2X9u-ZVTpyAk',
            order: 'relevance',
            prevPageToken: $scope.prevPageToken
        }).then(function(data) {
            //videoService.setVideoId(data.data.items[0].id.videoId);
            $scope.items = data.data.items;
            if ($scope.items) {
                $scope.btnStatus = null;
            }
            $scope.prevPageToken = $scope.nextPageToken;
            $scope.nextPageToken = data.data.nextPageToken;
            console.info('videos from search by query', data);
        });
    };
});

app.controller('viewController', function($scope, $sce, $routeParams, $resource, $location, youtubeFactory, userService) {
    $scope.video = {};
    $scope.videoId = $routeParams.id;
    var authApi = $resource('/auth/isLoggedIn');
    $scope.isAuthenticated = function() {
        authApi.get({}, function(user) {
            if (!user.username) {
                $location.path('/');
            }
        }, function(err) {
            if (err) {
                $location.path('/');
            }
        });
    };
    
    $scope.isAuthenticated();
    $scope.config = {
        sources: [{
            // src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.mp4"),
            src: "/video/?id=" + $scope.videoId,
            type: "video/mp4"
        }],
        theme: "node_modules/videogular-themes-default/videogular.css"
    };
    $scope.getVideoInfo = function() {
        youtubeFactory.getVideoById({
            videoId: $scope.videoId,
            part: 'id,snippet,statistics', // (optional) default: 'id,snippet,contentDetails,statistics'
            key: "AIzaSyBZ25cluRZvaImGXPsdQor2X9u-ZVTpyAk",
        }).then(function(_data) {
            console.log(_data);
            $scope.video.title = _data.data.items[0].snippet.title;
            $scope.video.views = _data.data.items[0].statistics.viewCount;
            $scope.video.likes = _data.data.items[0].statistics.likeCount;
            $scope.video.dislikes = _data.data.items[0].statistics.dislikeCount;
        }).catch(function(_data) {
            //on error
            console.log(_data);
        });
    };

    $scope.getVideoInfo();
});

app.controller('loginController', function($scope, $resource, $location, userService) {
    var localAuth = $resource('/auth/login');
    
    $scope.keyPress = function(keyCode) {
        if(keyCode == 13) {
            $scope.login();
        }
    };
    
    $scope.login = function() {
        var postAuth = new localAuth();
        postAuth.$save({
            username: $scope.username,
            password: $scope.password
        }, function(user) {
            if (user.username) {
                console.log('successful authentication');
                userService.addUserData(user);
                $location.path('/home');
                $scope.$apply();
            }
            else {
                $location.path('/');
            }
        }, function(err) {
            if (err) {
                $location.path('/');
            }
        });
    };
});

app.controller('frontController', function($scope, $resource, $location) {

});
