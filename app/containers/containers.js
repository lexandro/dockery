'use strict';

angular.module('containers', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/containers', {
            templateUrl: 'app/containers/containers.html',
            controller: 'ContainerCtrl'
        });
    }])
    .controller('ContainerCtrl', ['$rootScope', '$scope', '$location', 'Helpers', 'Docker', function ($rootScope, $scope, $location, Helpers, Docker) {
        if (Helpers.isEmpty($rootScope.hostUrl)) {
            $location.path('/hosts');
        } else {
            $scope.showAllContainersFlag = false;
            $scope.showContainerSizeFlag = false;
            $scope.selectAllFlag = false;
            //
            var sort = {};
            sort.column = 'Id'
            sort.direction = 'ascending';
            sort.desc = false;
            $scope.sort = sort;
            //
            refreshContainers();
            //
            $scope.refreshContainers = function () {
                $scope.containerListing = true;
                $scope.containerListingMessage = 'Loading container list';
                refreshContainers();
            };
            //
            $scope.switchSelected = function (containerData) {
                containerData.selected = !containerData.selected;
                if (!containerData.selected) {
                    $scope.selectAllFlag = false;
                }
            };
            $scope.switchSelectAllFlag = function () {
                $scope.selectAllFlag = !$scope.selectAllFlag;
                setSelected($scope.selectAllFlag);

            };
            //
            $scope.switchShowAllContainersFlag = function () {
                $scope.showAllContainersFlag = !$scope.showAllContainersFlag;
                refreshContainers();
            };
            $scope.switchShowContainerSizeFlag = function () {
                $scope.showContainerSizeFlag = !$scope.showContainerSizeFlag;
                refreshContainers();
            };
            //
            $scope.goImageDetails = function (path) {
                $location.path('/imageDetails/' + path);
            };
            //
            $scope.startContainer = function (containerId) {
                Docker.containers().start({containerId: containerId}, {}, function () {
                        refreshContainers();
                    }
                );
            };
            //
            $scope.killContainer = function (containerId) {
                Docker.containers().kill({containerId: containerId}, {}, function () {
                        refreshContainers();
                    }
                );
            };
            //
            $scope.pauseContainer = function (containerId) {
                Docker.containers().pause({containerId: containerId}, {}, function () {
                        refreshContainers();
                    }
                );
            };
            //
            $scope.unpauseContainer = function (containerId) {
                Docker.containers().unpause({containerId: containerId}, {}, function () {
                        refreshContainers();
                    }
                );
            };
            //
            $scope.stopContainer = function (containerId) {
                Docker.containers().stop({containerId: containerId}, {}, function () {
                        refreshContainers();
                    }
                );
            };
            //
            $scope.restartContainer = function (containerId) {
                Docker.containers().restart({containerId: containerId}, {}, function () {
                        refreshContainers();
                    }
                );
            };
            //
            $scope.removeContainer = function (containerId) {
                Docker.containers().remove({containerId: containerId, v: 1, force: 1}, {}, function () {
                        refreshContainers();
                    }
                );
            };
            //
            $scope.renameContainer = function (containerData) {
                containerData.renameContainerEnabled = !containerData.renameContainerEnabled;
                if (!containerData.renameContainerEnabled && containerData.newName != containerData.ContainerName) {
                    Docker.containers().rename({
                        containerId: containerData.Id,
                        name: containerData.newName
                    }, {}, function () {
                        refreshContainers();
                    }, function () {
                        refreshContainers();
                    });
                } else {
                    containerData.newName = containerData.ContainerName;
                }
            };
            //
            $scope.startSelectedContainers = function () {
                $scope.containerDataList.forEach(function (containerData) {
                    if (containerData.selected) {
                        $scope.startContainer(containerData.Id);
                    }
                });
            };
            $scope.stopSelectedContainers = function () {
                $scope.containerDataList.forEach(function (containerData) {
                    if (containerData.selected) {
                        $scope.stopContainer(containerData.Id);
                    }
                });
            };
            $scope.restartSelectedContainers = function () {
                $scope.containerDataList.forEach(function (containerData) {
                    if (containerData.selected) {
                        $scope.restartContainer(containerData.Id);
                    }
                });
            };
            $scope.killSelectedContainers = function () {
                $scope.containerDataList.forEach(function (containerData) {
                    if (containerData.selected) {
                        $scope.killContainer(containerData.Id);
                    }
                });
            };
            $scope.pauseSelectedContainers = function () {
                $scope.containerDataList.forEach(function (containerData) {
                    if (containerData.selected) {
                        $scope.pauseContainer(containerData.Id);
                    }
                });
            };
            $scope.unpauseSelectedContainers = function () {
                $scope.containerDataList.forEach(function (containerData) {
                    if (containerData.selected) {
                        $scope.unpauseContainer(containerData.Id);
                    }
                });
            };
            $scope.removeSelectedContainers = function () {
                $scope.containerDataList.forEach(function (containerData) {
                    if (containerData.selected) {
                        $scope.removeContainer(containerData.Id);
                    }
                });

            };

            $scope.createContainer = function () {
                $location.path('/createContainer');
            };

            $scope.keydown = function ($event, containerData) {
                if ($event.keyCode == 27) {
                    containerData.renameContainerEnabled = false;
                }
            };

            $scope.changeSorting = function (column) {
                $scope.sort = Helpers.changeSorting($scope.sort, column);
            };
        }

        function getContainerData(containerDataList, containerId) {
            var i = getContainerDataIndex(containerDataList, containerId);
            return containerDataList[i];
        }

        function upsertContainerData(containerDataList, containerData) {
            var i = getContainerDataIndex(containerDataList, containerData.Id);
            if (i > -1) {
                containerDataList[i] = containerData;
            } else {
                containerDataList.push(containerData);
            }
        }

        function getContainerDataIndex(containerDataList, containerId) {
            var found = false;
            var i = 0;
            while (i < containerDataList.length && !found) {
                if (containerDataList[i].Id === containerId) {
                    found = true;
                } else {
                    i++;
                }
            }
            return found ? i : -1;
        }

        function setSelected(selectedFlag) {
            $scope.containerDataList.forEach(function (containerData) {
                containerData.selected = selectedFlag;
            });
        }

        function refreshContainers() {
            var containerDataList = [];
            var containerParam = {};
            $scope.selectAllFlag = false;
            if ($scope.showAllContainersFlag == true) {
                containerParam.all = 1;
            }
            var containers = Docker.containers().query(containerParam, function () {
                $scope.containerListing = false;
                containers.forEach(function (container) {
                    var containerData = {};
                    containerData.renameContainerEnabled = false;
                    //
                    var containerStatus = '';
                    if (container.Status.indexOf('Up') == 0 || container.Status.indexOf('Restarting') == 0 || container.Status.indexOf('Removal') == 0) {
                        if (container.Status.indexOf('Paused') > -1 || container.Status.indexOf('Removal') == 0) {
                            containerStatus = 'paused';
                        } else {
                            containerStatus = 'running';
                        }
                    } else {
                        if (container.Status == '') {
                            containerStatus = 'created';
                        } else {
                            containerStatus = 'stopped';
                        }
                    }
                    containerData.Status = containerStatus;
                    containerData.Id = container.Id;
                    containerData.ImageName = container.Image;
                    containerData.Command = container.Command;
                    containerData.Diff = container.SizeRw;
                    containerData.Created = container.Created;
                    upsertContainerData(containerDataList, containerData);
                    var containerDetails = Docker.containers().get({containerId: container.Id}, function () {
                        //
                        containerData.ContainerName = containerDetails.Name;
                        containerData.Privileged = containerDetails.HostConfig.Privileged;
                    });

                });
                $scope.containerDataList = containerDataList;
            });
            if ($scope.showContainerSizeFlag == true) {
                containerParam = {};
                if ($scope.showAllContainersFlag == true) {
                    containerParam.all = 1;
                }
                if ($scope.showContainerSizeFlag == true) {
                    containerParam.size = 1;
                }
                $scope.containerSizeListing = true;
                $scope.containerSizeListingMessage = 'Querying container size data. It could take some time.';
                var containersWithSize = Docker.containers().query(containerParam, function () {
                    containersWithSize.forEach(function (containerWithSize) {
                        var containerData = getContainerData(containerDataList, containerWithSize.Id);
                        if (containerWithSize.Id == containerData.Id) {
                            containerData.SizeRw = containerWithSize.SizeRw;
                            containerData.SizeRootFs = containerWithSize.SizerRootFs;
                        }
                    });
                    $scope.containerSizeListing = false;
                    $scope.containerDataList = containerDataList;
                });
            }
        }
    }])
;