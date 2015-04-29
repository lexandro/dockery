'use strict';

angular.module('createContainer', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/createContainer', {
            templateUrl: 'app/createContainer/createContainer.html',
            controller: 'CreateContainerCtrl'
        });
    }])
    .controller('CreateContainerCtrl', ['$rootScope', '$scope', '$location', 'Helpers', 'Docker', function ($rootScope, $scope, $location, Helpers, Docker) {
        if (Helpers.isEmpty($rootScope.hostUrl)) {
            $location.path('/hosts');
        } else {
        }
    }]);