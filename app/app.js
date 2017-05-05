var app = angular.module('youtubeApp', ['ngResource', 'ngRoute', 'jtt_youtube', 'ngSanitize', 'com.2fdevs.videogular', 'com.2fdevs.videogular.plugins.controls']);

app.config(function($routeProvider, $httpProvider) {
    $routeProvider
        .when("/", {
            controller: 'frontController',
            templateUrl: "/public/views/frontPage.html"
        })
        .when("/login/", {
            controller: 'loginController',
            templateUrl: "/public/views/loginPage.html"
        })
        .when("/home/", {
            controller: 'homeController',
            templateUrl: "/public/views/homePage.html"
        })
        .when("/view/", {
            controller: 'viewController',
            templateUrl: "/public/views/viewVideo.html"
        })
        .otherwise({
            redirectTo: '/'
        });
});


app.run(function($rootScope, $resource, $location) {
    var authApi = $resource('/auth/isLoggedIn');
    $rootScope.isAuthenticated = function() {
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

    $rootScope.$on("$locationChangeStart", function(event, next, current) {
        // handle route changes     
        console.log($location.path());
        if ($location.path() == '/login/' || $location.path() == '/') {

        }
        else {
            $rootScope.isAuthenticated();
        }
    });
});
