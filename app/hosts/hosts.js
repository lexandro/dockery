'use strict';

angular.module('hosts', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/hosts', {
            templateUrl: 'app/hosts/hosts.html',
            controller: 'HostCtrl'
        });
    }])
    .controller('HostCtrl', ['$rootScope', '$scope', '$location', 'Containers', function ($rootScope, $scope, $location, Containers) {

        var containers = Containers.query(function () {
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

                var containerDetails = Containers.get({containerId: container.Id}, function () {
                    $scope.containerDetails = containerDetails;
                    containerData.ImageId = containerDetails.Image;
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
    }])
;