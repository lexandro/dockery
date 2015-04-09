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
            $scope.showLogs = function (containerId) {
                $scope.activeTab = 'logs';
                console.log(containerId);
                var logParams = {}
                logParams.stderr = 1;
                logParams.stdout = 1;
                logParams.timestamps = 1;
                logParams.containerId = containerId;

                //http://stackoverflow.com/questions/26059955/angularjs-get-byte-error-when-downloading-binary-data-using-asp-net-web-api
                //$http.get('http://example.com', {responseType: 'arraybuffer'})

                var containerLogs = Docker.containers().logs(logParams, function () {
                    console.log('Amount of data ' + containerLogs.length);
                    console.log('Data ' + JSON.stringify(containerLogs));
                    var counter = 0;
                    var line = '';
                    var data = '';
                    for (data in containerLogs) {
                        if (counter < 8) {
                            counter++;
                        } else {
                            console.log(data);
                            if (data != '/n') {
                                line += data;
                            } else {
                                console.log(line);
                                line = '';
                                counter = 0;
                            }
                        }
                    }
                    console.log('Log processed');
                    //console.log(JSON.stringify(containerLogs));
                });
            };

            $scope.showProcesses = function (containerId) {
                $scope.activeTab = 'top';
                var containerProcesses = Docker.containers().top({containerId: containerId}, function () {
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
                $scope.firstDiffPage = function () {
                    diffSettings["pageIndex"] = 1;
                    updateDiffPagedList();
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
                $scope.lastDiffPage = function () {
                    diffSettings["pageIndex"] = diffSettings["maxPageIndex"];
                    updateDiffPagedList();
                }
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