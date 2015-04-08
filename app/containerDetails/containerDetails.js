'use strict';

angular.module('containerDetails', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/containerDetails/:containerId', {
            templateUrl: 'app/containerDetails/containerDetails.html',
            controller: 'ContainerDetailsCtrl'
        });
    }])

    .controller('ContainerDetailsCtrl', ['$rootScope', '$scope', '$location', '$routeParams', 'Helpers', 'Docker', function ($rootScope, $scope, $location, $routeParams, Helpers, Docker) {
        if (Helpers.isEmpty($rootScope.hostUrl)) {
            $location.path('/hosts');
        } else {
            $scope.activeTab = 'logs';
            var containerDetails = Docker.containers().get({containerId: $routeParams.containerId}, function () {
                $scope.containerDetails = containerDetails;
            });

            $scope.showLogs = function (containerId) {
                $scope.activeTab = 'logs';
                console.log(containerId);
            };

            $scope.showProcesses = function (containerId) {
                $scope.activeTab = 'ps';
                console.log(containerId);
            };


            $scope.showDiff = function (containerId) {
                $scope.activeTab = 'diff';
                $scope.currentDiffPage = 0;
                console.log("loading diffs");

                var containerDiffs = Docker.containers().diff({containerId: containerId}, function () {
                    var subDiffs = [];
                    for (var i = 0; i < 30 && i < containerDiffs.length; i++) {
                        subDiffs.push(containerDiffs[i]);
                    }
                    $scope.containerDiffs = subDiffs;
                    console.log("loaded diffs");
                });

            };

            $scope.showTty = function (containerId) {
                $scope.activeTab = 'tty';
                console.log(containerId);
            };


            $scope.showJson = function (containerId) {
                $scope.activeTab = 'json';
                console.log(containerId);
            };
        }
    }])
;