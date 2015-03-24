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

            var containers = Docker.containers().query(function () {
                var containerDataList = [];
                containers.forEach(function (container) {
                    var containerData = {};
                    containerData.Id = container.Id;
                    containerData.Image = container.Image;
                    containerData.Command = container.Command;
                    containerData.Created = container.Created;
                    containerData.Status = container.Status;
                    containerData.Ports = container.Ports;
                    containerDataList.push(containerData);

                    var containerDetails = Docker.containers().get({containerId: container.Id}, function () {
                        $scope.containerDetails = containerDetails;
                        containerData.ImageId = containerDetails.Image;
                        containerData.Name = containerDetails.Name.substr(1);
                    });

                });
                $scope.containerDataList = containerDataList;
            });
            //
            $scope.goContainerDetails = function (path) {
                $location.path('/containerDetails/' + path);
            };
            //
            $scope.goImageDetails = function (path) {
                $location.path('/imageDetails/' + path);
            };
        }
    }]);