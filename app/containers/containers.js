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


            refreshContainers();

            $scope.refreshContainers = function () {
                $scope.containerListing = true;
                $scope.containerListingMessage = 'Loading container list';
                refreshContainers();
            };
            //
            $scope.switchSelected = function (containerData) {
                containerData.selected = !containerData.selected;
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
            $scope.goContainerDetails = function (path) {
                $location.path('/containerDetails/' + path);
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
            $scope.startSelectedContainers = function () {
                $scope.containerDataList.forEach(function (containerData) {
                    if (containerData.selected) {
                        $scope.startContainer(containerData.container.Id);
                    }
                });
            };
            $scope.stopSelectedContainers = function () {
                $scope.containerDataList.forEach(function (containerData) {
                    if (containerData.selected) {
                        $scope.stopContainer(containerData.container.Id);
                    }
                });
            };
            $scope.restartSelectedContainers = function () {
                $scope.containerDataList.forEach(function (containerData) {
                    if (containerData.selected) {
                        $scope.restartContainer(containerData.container.Id);
                    }
                });
            };
            $scope.killSelectedContainers = function () {
                $scope.containerDataList.forEach(function (containerData) {
                    if (containerData.selected) {
                        $scope.killContainer(containerData.container.Id);
                    }
                });
            };
            $scope.pauseSelectedContainers = function () {
                $scope.containerDataList.forEach(function (containerData) {
                    if (containerData.selected) {
                        $scope.pauseContainer(containerData.container.Id);
                    }
                });
            };
            $scope.unpauseSelectedContainers = function () {
                $scope.containerDataList.forEach(function (containerData) {
                    if (containerData.selected) {
                        $scope.unpauseContainer(containerData.container.Id);
                    }
                });
            };
            $scope.removeSelectedContainers = function () {
                $scope.containerDataList.forEach(function (containerData) {
                    if (containerData.selected) {
                        $scope.removeContainer(containerData.container.Id);
                    }
                });

            };
        }

        function getContainerData(containerDataList, containerId) {
            var i = getContainerDataIndex(containerDataList, containerId);
            return containerDataList[i];
        }

        function upsertContainerData(containerDataList, containerData) {
            var i = getContainerDataIndex(containerDataList, containerData.container.Id);
            if (i > -1) {
                ontainerDataList[i] = containerData;
            } else {
                containerDataList.push(containerData);
            }
        }

        function getContainerDataIndex(containerDataList, containerId) {
            var found = false;
            var i = 0;
            while (i < containerDataList.length && !found) {
                if (containerDataList[i].container.Id === containerId) {
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
            if ($scope.showAllContainersFlag == true) {
                containerParam.all = 1;
            }
            var containers = Docker.containers().query(containerParam, function () {
                $scope.containerListing = false;
                containers.forEach(function (container) {
                    var containerData = {};
                    containerData.container = container;

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
                    containerData.containerStatus = containerStatus;
                    upsertContainerData(containerDataList, containerData);
                    var containerDetails = Docker.containers().get({containerId: container.Id}, function () {
                        $scope.containerDetails = containerDetails;
                        containerData.containerDetails = containerDetails;
                    });

                });
                $scope.containerDataList = containerDataList;
                setSelected($scope.selectAllFlag);
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
                        if (containerWithSize.Id == containerData.container.Id) {
                            containerData.container = containerWithSize;
                        }
                    });
                    $scope.containerSizeListing = false;
                    $scope.containerDataList = containerDataList;
                });
            }
        }
    }])
;