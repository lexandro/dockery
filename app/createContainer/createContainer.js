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
            $scope.environmentVariables = [{}];
            $scope.entryPoints = [{value: ""}];
            $scope.workDir = "";
            $scope.publishAllPorts = false;
            $scope.publishedPorts = [{port: "", protocol: 'tcp', port2: ""}];
            $scope.exposedPorts = [{value: "", protocol: "tcp", status: ""}];
            $scope.portBindings = [{port: "", protocol: "tcp", hostIp: "0.0.0.0", hostPort: "", status: ""}];
            $scope.hostVolumeBindings = [{value: "", writable: true, status: ""}];
            $scope.volumeBindings = [{value: "", writable: true, status: ""}];


            // TODO !!!!!!
            $scope.isSelected = true;

            $scope.$watch('isSelected', function () {
                console.log('Selection changed.' + $scope.isSelected);
            });

            //
            $scope.createContainer = function (startFlag) {
                // TODO add name format check
                var validation = {};
                var newContainerParameters = {};
                if (!isEmpty($scope.imageName)) {
                    newContainerParameters.Image = $scope.imageName;
                } else {
                    validation.imageNameRequired = true;
                }

                if (!isEmpty($scope.command)) {
                    newContainerParameters.Cmd = $scope.command.split(' ');
                }

                if (!isEmpty($scope.tty)) {
                    newContainerParameters.Tty = $scope.tty;
                }

                // converting env variables
                if ($scope.environmentVariables.length > 1) {
                    var envs = [];
                    $scope.environmentVariables.forEach(function (envVar) {
                        envs.push(envVar.name + '=' + envVar.value);
                    });
                    envs.splice(envs.length - 1, 1);
                    //
                    newContainerParameters.Env = envs;
                }

                // generating entrypoint entry
                if ($scope.entryPoints.length > 1) {
                    var entryPointStrings = [];
                    $scope.entryPoints.forEach(function (entryPoint) {
                        entryPointStrings.push(entryPoint.value);
                    });
                    entryPointStrings.splice(entryPointStrings.length - 1, 1);
                    newContainerParameters.Entrypoint = entryPointStrings;
                }

                if (!isEmpty($scope.workDir)) {
                    newContainerParameters.WorkingDir = $scope.workDir;
                }
                //
                newContainerParameters.HostConfig = {};
                if ($scope.privileged == true) {
                    newContainerParameters.HostConfig.Privileged = true;
                }

                if ($scope.publishAllPorts) {
                    newContainerParameters.HostConfig.PublishAllPorts = true;
                }
                //
                if ($scope.exposedPorts.length > 1) {
                    var exposedPortsData = $scope.exposedPorts;
                    var ExposedPorts = {};
                    var newExposedPortsData = [];
                    exposedPortsData.forEach(function (exposedPort) {
                        if (!isEmpty(exposedPort.value)) {
                            if (isPositiveInteger(exposedPort.value) && !isPortDuplicated(newExposedPortsData, exposedPort)) {
                                newExposedPortsData.push(exposedPort);
                                ExposedPorts[exposedPort.value + "/" + exposedPort.protocol] = {};
                            }
                        }
                    });
                    newContainerParameters.ExposedPorts = ExposedPorts;
                }
                //
                if ($scope.portBindings.length > 1) {
                    var portBindingsData = $scope.portBindings;
                    var newBindings = [];
                    var PortBindings = {};
                    portBindingsData.forEach(function (portBinding) {

                        if (!isEmpty(portBinding.port) || !isEmpty(portBinding.hostPort)) {
                            if (isPositiveInteger(portBinding.port) && !isBindingDuplicated(newBindings, portBinding) && isPositiveInteger(portBinding.hostPort)) {
                                PortBindings[portBinding.port + "/" + portBinding.protocol] =
                                    [{hostIp: portBinding.hostIp, hostPort: portBinding.hostPort}];
                                newBindings.push(portBinding);
                            }
                        }
                    });
                    newContainerParameters.HostConfig.PortBindings = PortBindings;
                }
                //
                console.log(JSON.stringify(newContainerParameters));
                //
                $scope.validation = validation;

                var createdContainer = Docker.containers().create($scope.newContainerName ? {name: $scope.newContainerName} : null, newContainerParameters,

                    function () {
                        console.log(JSON.stringify(createdContainer));
                        if (startFlag == true) {
                            Docker.containers().start({containerId: createdContainer.Id}, {}, function () {
                                $location.path('/containers');
                            });
                        } else {
                            $location.path('/containers');
                        }
                    }
                )
            };


            $scope.createAndStartContainer = function () {
                $scope.createContainer(true);
                console.log('and start');
            };
            //
            $scope.generateContainerName = function () {
                $scope.newContainerName = 'random_container';
            };

            $scope.envVarValidator = function () {
                var envVars = $scope.environmentVariables;
                var newEnvVars = [];
                envVars.forEach(function (env, index) {
                    if (!isEmpty(env.name) || !isEmpty(env.value)) {
                        newEnvVars.push(env);
                    }
                });
                newEnvVars.push({name: "", value: ""});
                $scope.environmentVariables = newEnvVars;

            };

            $scope.entryPointValidator = function () {
                var entryPoints = $scope.entryPoints;
                var newEntryPoints = [];
                entryPoints.forEach(function (entryPoint) {
                    if (!isEmpty(entryPoint.value)) {
                        newEntryPoints.push(entryPoint);
                    }
                });

                newEntryPoints.push({value: ""});
                $scope.entryPoints = newEntryPoints;
            }

        }

        $scope.exposedPortValidator = function () {
            var exposedPorts = $scope.exposedPorts;
            var newExposedPorts = [];
            exposedPorts.forEach(function (port, index) {
                if (!isEmpty(port.value)) {
                    if (isPositiveInteger(port.value) && !isPortDuplicated(newExposedPorts, port)) {
                        port.status = "valid";
                    } else {
                        port.status = "invalid";
                    }
                    newExposedPorts.push(port);
                }
            });
            newExposedPorts.push({value: "", protocol: "tcp", status: ""});
            $scope.exposedPorts = newExposedPorts;
        };

        $scope.portBindingValidator = function () {
            var portBindings = $scope.portBindings;
            var newBindings = [];
            portBindings.forEach(function (portBinding, index) {
                if (!isEmpty(portBinding.port) || !isEmpty(portBinding.hostPort)) {
                    if (isPositiveInteger(portBinding.port) && !isBindingDuplicated(newBindings, portBinding) && isPositiveInteger(portBinding.hostPort)) {
                        portBinding.status = "valid";
                    } else {
                        portBinding.status = "invalid";
                    }
                    newBindings.push(portBinding);
                }
            });
            newBindings.push({port: "", protocol: "tcp", hostIp: "0.0.0.0", hostPort: "", status: ""});
            $scope.portBindings = newBindings;
        };


        $scope.hostVolumeBindingValidator = function () {
            var hostVolumeBindings = $scope.hostVolumeBindings;
            var newHostVolumeBindings = [];
            hostVolumeBindings.forEach(function (hostVolumeBinding, index) {
                if (!isEmpty(hostVolumeBinding.value)) {
                    newHostVolumeBindings.push(hostVolumeBinding);
                }
            });
            newHostVolumeBindings.push({value: "", writable: true, status: ""});
            $scope.hostVolumeBindings = newHostVolumeBindings;
        };

        $scope.volumeBindingValidator = function () {
            var VolumeBindings = $scope.volumeBindings;
            var newVolumeBindings = [];
            VolumeBindings.forEach(function (volumeBinding, index) {
                if (!isEmpty(volumeBinding.value)) {
                    newVolumeBindings.push(volumeBinding);
                }
            });
            newVolumeBindings.push({value: "", writable: true, status: ""});
            $scope.volumeBindings = newVolumeBindings;
        };


        $scope.deleteEnvVarEntry = function (index) {
            $scope.deleteFromArray($scope.environmentVariables, index);
        };

        $scope.deleteEntryPointEntry = function (index) {
            $scope.deleteFromArray($scope.entryPoints, index);
        };

        $scope.deleteExposedPortEntry = function (index) {
            $scope.deleteFromArray($scope.exposedPorts, index);
        };

        $scope.deletePortBinding = function (index) {
            $scope.deleteFromArray($scope.portBindings, index);
        };

        $scope.deleteHostVolumeBinding = function (index) {
            $scope.deleteFromArray($scope.hostVolumeBindings, index);
        };

        $scope.deleteVolumeBinding = function (index) {
            $scope.deleteFromArray($scope.volumeBindings, index);
        };

        $scope.deleteFromArray = function (array, index) {
            var arrayLength = array.length;
            if (arrayLength > 1 && index < arrayLength - 1) {
                array.splice(index, 1);
            }
        };

        function isPortDuplicated(newExposedPorts, port) {
            var result = false;
            newExposedPorts.forEach(function (newPort) {
                if (parseInt(newPort.value) == parseInt(port.value)) {
                    result = true;
                }
            });
            return result;
        }

        function isBindingDuplicated(newBindings, portBinding) {
            var result = false;
            newBindings.forEach(function (newPortBinding) {
                if ((parseInt(newPortBinding.port) == parseInt(portBinding.port))
                    ||
                    (parseInt(newPortBinding.hostPort) == parseInt(portBinding.hostPort))) {
                    result = true;
                }
            });
            return result;
        }


        function isEmpty(obj) {
            return Helpers.isEmpty(obj);
        }

        function isPositiveInteger(obj) {
            return Helpers.isPositiveInteger(obj);
        }
    }]
);