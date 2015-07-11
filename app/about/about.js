'use strict';

angular.module('about', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/about', {
            templateUrl: 'app/about/about.html',
            controller: 'AboutCtrl'
        });
    }])

    .controller('AboutCtrl', ['$rootScope', '$scope', '$location', '$routeParams', 'Helpers', 'Docker', function ($rootScope, $scope, $location, $routeParams, Helpers, Docker) {
        $scope.openTwitter = function () {
            console.log('openwtite');
            chrome.tabs.create({url: 'https://twitter.com'});
        }
    }]);