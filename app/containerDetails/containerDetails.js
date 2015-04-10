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
            var logSettings = [];
            logSettings["showStdOut"] = true;
            logSettings["stdOutTail"] = 1000;
            logSettings["stdOutTimestamp"] = true;
            logSettings["showStdErr"] = true;
            logSettings["stdErrTail"] = 1000;
            logSettings["stdErrTimestamp"] = true;
            $scope.logSettings = logSettings;

            //
            var containerDetails = Docker.containers().get({containerId: $routeParams.containerId}, function () {
                $scope.containerDetails = containerDetails;
                $scope.showProcesses($routeParams.containerId);
            });
            //
            $scope.showLogs = function (containerId) {
                $scope.activeTab = 'logs';


                var logParams = {}
                logParams.stderr = 0;
                logParams.stdout = 1;
                logParams.timestamps = 1;
                logParams.tail = 1000;

                Docker.containerLogs(containerId, logParams, function (data, status, headers, config) {
                    //data = data.replace(/[\r]/g, '\n');
                    //data = data.substring(8);
                    //data = data.replace(/\n(.{8})/g, '\n');

                    $scope.stdOutLog = data;

                    var dateRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{9}Z)/;
                    //dateRegex = /\d{4}/;
                    console.log('regex ' + data.search(dateRegex));
                    //

                    //for (var i = 0; i < data.length; i++) {
                    //    console.log(i + ". 0x" + data[i].charCodeAt(0).toString(16) + " " + data[i]);
                    //}

                    //var line = "";
                    //var count = 0;
                    //console.log('log here');
                    //for (var i = 0; i < data.length; i++) {
                    //    count++;
                    //    if (count > 8) {
                    //        line += data[i];
                    //        //console.log('in ' + i + ". " + data[i].charCodeAt(0) + " - " + line);
                    //        if (data[i].charCodeAt(0) == 10) {
                    //            console.log('newline');
                    //            console.log(line);
                    //            line = '';
                    //            count = 0;
                    //        }
                    //    }
                    //
                    //}


                    logParams.stderr = 1;
                    logParams.stdout = 0;
                    Docker.containerLogs(containerId, logParams, function (data, status, headers, config) {
                        //data = data.replace(/[\r]/g, '\n');
                        data = data.substring(8);
                        //data = data.replace(/\n(.{8})/g, '\n');
                        $scope.stdErrLog = data;
                    });
                });
                $scope.switchStdOutPanel = function () {
                    logSettings["showStdOut"] = !logSettings["showStdOut"];
                };
                $scope.switchStdErrPanel = function () {
                    logSettings["showStdErr"] = !logSettings["showStdErr"];
                };
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