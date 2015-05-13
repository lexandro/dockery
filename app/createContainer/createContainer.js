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
            $scope.imageName = 'lexandro/echo-repeat';
            $scope.rm = false;
            $scope.detach = true;
            $scope.tty = true;
            $scope.interactive = true;
            $scope.privileged = false;
            $scope.validation = {};
            //
            //
            $scope.createContainer = function () {
                console.log('create start');
                // TODO add name format check
                $scope.validation.imageNameRequired = Helpers.isEmpty($scope.imageName);
                $scope.validation.newContainerNameRequired = Helpers.isEmpty($scope.newContainerName);
                $scope.command = '' + $scope.command;
                var createdContainer = Docker.containers().create($scope.newContainerName ? {name: $scope.newContainerName} : null,
                    {
                        Image: $scope.imageName,
                        Cmd: $scope.command.split(' '),
                        Tty: $scope.tty,
                        HostConfig: {
                            Privileged: $scope.privileged
                        }

                    },
                    function () {
                        console.log(JSON.stringify(createdContainer));
                        Docker.containers().start({containerId: createdContainer.Id}, {});
                    }
                )
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
    }])
;