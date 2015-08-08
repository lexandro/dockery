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
            var containerDetails = {};
            $scope.Object = Object;
            $scope.activeTab = 'info';
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
            logSettings["stdOutTailAll"] = false;
            logSettings["stdOutTimestamp"] = true;
            logSettings["showStdErr"] = true;
            logSettings["stdErrTail"] = 1000;
            logSettings["stdErrTailAll"] = false;
            logSettings["stdErrTimestamp"] = true;
            $scope.logSettings = logSettings;
            // dirt hack to emulate destroy function :)
            var term = {};
            $scope.containerDetailsLoadingMessage = 'Loading container data';
            $scope.containerTopLoading = false;
            $scope.containerLogsLoading = false;
            $scope.containerDiffLoading = false;
            //
            $scope.imageCommitMessage = "";
            $scope.imageAuthorName = "";
            $scope.imageRepositoryName = "";
            $scope.imageRepositoryTagName = "latest";
            $scope.dismissTarget = "";

            loadContainerDetails();
            //
            $scope.isEmpty = function (obj) {
                return Helpers.isEmpty(obj);
            };
            //
            $scope.startContainer = function () {
                Docker.containers().start({containerId: $routeParams.containerId}, {}, function () {
                        loadContainerDetails();
                    }
                );
            };
            //
            $scope.killContainer = function () {
                Docker.containers().kill({containerId: $routeParams.containerId}, {}, function () {
                        loadContainerDetails();
                    }
                );
            };
            //
            $scope.pauseContainer = function () {
                Docker.containers().pause({containerId: $routeParams.containerId}, {}, function () {
                        loadContainerDetails();
                    }
                );
            };
            //
            $scope.unpauseContainer = function () {
                Docker.containers().unpause({containerId: $routeParams.containerId}, {}, function () {
                        loadContainerDetails();
                    }
                );
            };
            //
            $scope.stopContainer = function () {
                Docker.containers().stop({containerId: $routeParams.containerId}, {}, function () {
                        loadContainerDetails();
                    }
                );
            };
            //
            $scope.restartContainer = function () {
                Docker.containers().restart({containerId: $routeParams.containerId}, {}, function () {
                        loadContainerDetails();
                    }
                );
            };
            //
            $scope.removeContainer = function () {
                Docker.containers().remove({containerId: $routeParams.containerId, v: 1, force: 1}, {}, function () {
                        $location.path('/containers');
                    }
                );
            };
            //
            $scope.commitContainer = function () {
                //
                $scope.dismissTarget = "modal";
                //
                var committedContainer = Docker.commit().save({
                        container: $routeParams.containerId,
                        comment: $scope.imageCommitMessage,
                        author: $scope.imageAuthorName,
                        repo: $scope.imageRepositoryName,
                        tag: $scope.imageRepositoryTagName
                    },
                    $scope.containerDetails.Config,
                    function () {
                        console.log('done ' + JSON.stringify(committedContainer));
                    }
                );
            };
            //
            $scope.downloadAllLogs = function () {
                console.log('download ' + $rootScope.hostUrl + '/containers/' + $routeParams.containerId + '/logs?stderr=1&stdout=1');
            };
            //
            $scope.showLogs = function (containerId) {
                $scope.containerLogsLoading = true;
                $scope.containerLogsLoadingMessage = 'Loading log information';
                if (!Helpers.isEmpty(term)) {
                    term.destroy();
                }
                $scope.activeTab = 'logs';
                var logParams = {};
                logParams.stderr = 0;
                logParams.stdout = 1;
                logParams.timestamps = logSettings["stdOutTimestamp"];
                logParams.tail = logSettings["stdOutTailAll"] == true ? true : logSettings["stdOutTail"];

                Docker.containerLogs(containerId, logParams, function (data, status, headers, config) {
                    $scope.stdOutLog = data;
                    logParams.stderr = 1;
                    logParams.stdout = 0;
                    logParams.timestamps = logSettings["stdErrTimestamp"];
                    logParams.tail = logSettings["stdErrTailAll"] == true ? true : logSettings["stdErrTail"];
                    Docker.containerLogs(containerId, logParams, function (data, status, headers, config) {
                        $scope.containerLogsLoading = false;
                        data = data.substring(8);
                        $scope.stdErrLog = data;
                    });
                });

                $scope.switchStdOutPanel = function () {
                    logSettings["showStdOut"] = !logSettings["showStdOut"];
                };
                $scope.switchStdErrPanel = function () {
                    logSettings["showStdErr"] = !logSettings["showStdErr"];
                };

                $scope.refreshStdOutLogs = function () {
                    logParams.stderr = 0;
                    logParams.stdout = 1;
                    logParams.timestamps = logSettings["stdOutTimestamp"];
                    logParams.tail = logSettings["stdOutTailAll"] == true ? true : logSettings["stdOutTail"];
                    Docker.containerLogs(containerId, logParams, function (data, status, headers, config) {
                        $scope.stdOutLog = data;
                    });
                };
                $scope.switchShowStdOutTimestamp = function () {
                    logSettings["stdOutTimestamp"] = !logSettings["stdOutTimestamp"];
                    $scope.refreshStdOutLogs();
                };

                $scope.switchStdOutTailAll = function () {
                    logSettings["stdOutTailAll"] = !logSettings["stdOutTailAll"];
                    $scope.refreshStdOutLogs();
                };

                $scope.refreshStdErrLogs = function () {
                    logParams.stderr = 1;
                    logParams.stdout = 0;
                    logParams.timestamps = logSettings["stdErrTimestamp"];
                    logParams.tail = logSettings["stdErrTailAll"] == true ? true : logSettings["stdErrTail"];
                    Docker.containerLogs(containerId, logParams, function (data, status, headers, config) {
                        $scope.stdErrLog = data;
                    });
                };

                $scope.switchShowStdErrTimestamp = function () {
                    logSettings["stdErrTimestamp"] = !logSettings["stdErrTimestamp"];
                    $scope.refreshStdErrLogs();
                };
                $scope.switchStdErrTailAll = function () {
                    logSettings["stdErrTailAll"] = !logSettings["stdErrTailAll"];
                    $scope.refreshStdErrLogs();
                };
            };

            $scope.showInfo = function (containerId) {
                $scope.activeTab = 'info';
            }

            $scope.showProcesses = function (containerId) {
                if (!Helpers.isEmpty(term)) {
                    term.destroy();
                }
                //
                $scope.activeTab = 'top';
                if (containerDetails.State.Running) {
                    $scope.containerTopLoading = true;
                    $scope.containerTopLoadingMessage = 'Loading process information';
                    var containerProcesses = Docker.containers().top({containerId: containerId}, function () {
                        $scope.containerTopLoading = false;
                        $scope.containerProcesses = containerProcesses;
                    });
                }
            };

            $scope.showDiff = function (containerId) {
                if (!Helpers.isEmpty(term)) {
                    term.destroy();
                }
                //
                var containerDiffs = {};
                $scope.containerDiffLoading = true;
                $scope.containerDiffLoadingMessage = 'Loading container diff information. Be patient! It could take some time.';
                //
                var refreshDiffs = function () {
                    containerDiffs = Docker.containers().diff({containerId: containerId}, function () {
                        $scope.containerDiffLoading = false;
                        updateDiffPagedList();
                    });
                };
                //
                $scope.activeTab = 'diff';
                refreshDiffs();
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

                $scope.refreshDiffs = function () {
                    refreshDiffs();
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
                var termContainer = document.getElementById('terminal');
                term = new Terminal();
                var url = $rootScope.hostUrl.replace('http:', 'ws:').replace('https:', 'wss:') + '/containers/' + containerId + '/attach/ws?logs=0&stream=1&stdout=1&stderr=1&stdin=1';
                var socket = new WebSocket(url);
                term.open(termContainer);
                term.resize(80, 25);
                term.on('data', function (data) {
                    socket.send(data);
                });
                socket.onmessage = function (e) {
                    term.write(e.data);
                }
            };

            $scope.showJson = function (containerId) {
                if (!Helpers.isEmpty(term)) {
                    term.destroy();
                }
                //
                $scope.activeTab = 'json';
            };

            $scope.$on("$destroy", function () {
                if (!Helpers.isEmpty(term)) {
                    term.destroy();
                }
            });

        }

        function loadContainerDetails() {
            $scope.containerDetailsLoading = true;
            containerDetails = Docker.containers().get({containerId: $routeParams.containerId}, function () {
                $scope.containerDetailsLoading = false;
                $scope.containerDetails = containerDetails;
                $scope.showInfo($routeParams.containerId);
                //
                $scope.canStart = !containerDetails.State.Running;
                $scope.canStop = containerDetails.State.Running && !containerDetails.State.Paused;
                $scope.canRestart = $scope.canStop;
                $scope.canKill = $scope.canStop;
                $scope.canPause = $scope.canStop;
                $scope.canUnpause = containerDetails.State.Running && containerDetails.State.Paused;
                $scope.canRemove = !containerDetails.State.Running;
                // removing angular related objects
                delete containerDetails["$promise"];
                delete containerDetails["$resolved"];
                // TODO check output format with multiple port situation
                var portAssignments = "";
                for (var key in containerDetails.NetworkSettings.Ports) {
                    portAssignments = portAssignments + key + ':';
                    //var portArray = containerDetails.NetworkSettings.PortMapping.Ports[key];
                    //portArray.forEach(function (port) {
                    //    portAssignments += port["HostPort"];
                    //});
                    portAssignments += ', ';
                }
                $scope.portAssignments = portAssignments.substring(0, portAssignments.length - 2);
            });
        }
    }])
;