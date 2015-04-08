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
            $scope.activeTab = 'top';
            $scope.newDiffPageSize = 20;
            //
            var diffSettings = [];
            diffSettings["pageIndex"] = 1;
            diffSettings["maxPageIndex"] = 0;
            diffSettings["startIndex"] = 0;
            diffSettings["endIndex"] = 0;
            diffSettings["pageSize"] = $scope.newDiffPageSize;
            $scope.diffSettings = diffSettings;

            //
            var containerDetails = Docker.containers().get({containerId: $routeParams.containerId}, function () {
                $scope.containerDetails = containerDetails;
                $scope.showProcesses($routeParams.containerId);
            });
            //
            //
            $scope.showLogs = function (containerId) {
                $scope.activeTab = 'logs';
                console.log(containerId);
            };

            $scope.showProcesses = function (containerId) {
                $scope.activeTab = 'top';
                console.log(containerId);
                var containerProcesses = Docker.containers().top({containerId: containerId}, function () {
                    console.log(JSON.stringify(containerProcesses));
                    $scope.containerProcesses = containerProcesses;
                });
            };

            $scope.showDiff = function (containerId) {
                $scope.activeTab = 'diff';
                var containerDiffs = Docker.containers().diff({containerId: containerId}, function () {
                    updateDiffPagedList();
                });
                //
                var updateDiffPagedList = function () {
                    var diffPageSize = $scope.newDiffPageSize;
                    diffSettings["pageSize"] = diffPageSize;
                    diffSettings["maxPageIndex"] = Math.trunc(containerDiffs.length / diffPageSize) + 1;
                    diffSettings["pageIndex"] = Math.min(diffSettings["maxPageIndex"], diffSettings["pageIndex"]);
                    diffSettings["count"] = containerDiffs.length;
                    var subDiffs = [];
                    var startIndex = containerDiffs.length > 0 ? (diffSettings["pageIndex"] - 1) * diffPageSize + 1 : 0;
                    var endIndex = Math.min((diffSettings["pageIndex"]) * diffPageSize, containerDiffs.length);

                    diffSettings["startIndex"] = startIndex;
                    diffSettings["endIndex"] = endIndex;

                    for (var i = startIndex - 1; i < endIndex; i++) {
                        subDiffs.push(containerDiffs[i]);
                    }
                    $scope.containerDiffs = subDiffs;
                };

                $scope.changeDiffPaging = function () {
                    if ($scope.newDiffPageSize != diffSettings["pageSize"]) {
                        updateDiffPagedList();
                    }
                };
                $scope.prevDiffPage = function () {
                    if (diffSettings["pageIndex"] > 1) {
                        diffSettings["pageIndex"]--;
                        updateDiffPagedList();
                    }
                };
                $scope.nextDiffPage = function () {
                    if (diffSettings["pageIndex"] < diffSettings["maxPageIndex"]) {
                        diffSettings["pageIndex"]++;
                        updateDiffPagedList();
                    }
                };
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