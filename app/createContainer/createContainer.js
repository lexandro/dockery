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
            $scope.imageName = 'ubuntu';
            $scope.rm = false;
            $scope.detach = true;
            $scope.tty = true;
            $scope.interactive = true;
            $scope.privileged = false;
            //
            $scope.createContainer = function () {
                console.log('create');
            };
            $scope.createAndStartContainer = function () {
                $scope.createContainer();
                console.log('and start');
            };
            //
            $scope.generateContainerName = function () {
                $scope.newContainerName = 'random_container';
            };
        }
    }]);