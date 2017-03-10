var app = angular.module('youtubeApp', ['ngResource', 'ngRoute', 'jtt_youtube','ngSanitize', 'com.2fdevs.videogular', 'com.2fdevs.videogular.plugins.controls']);

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
