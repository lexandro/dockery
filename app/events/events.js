'use strict';

angular.module('events', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/events', {
            templateUrl: 'app/events/events.html',
            controller: 'EventsCtrl'
        });
    }])

    .controller('EventsCtrl', ['$rootScope', '$scope', '$location', '$routeParams', 'Helpers', 'Docker', function ($rootScope, $scope, $location, $routeParams, Helpers, Docker) {
        if (Helpers.isEmpty($rootScope.hostUrl)) {
            $location.path('/hosts');
        } else {

        }
    }]);