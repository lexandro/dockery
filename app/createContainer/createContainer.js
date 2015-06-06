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
            $scope.volumesFrom = [{containerId: "", writable: true, status: ""}];
            $scope.containerNameStatus = true;
            // !!!!!!!!!!!!
            $scope.containerListing = true;

            //
            var containers = Docker.containers().query({all: 1}, function () {
                $scope.containerListing = false;
                $scope.containers = containers;
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
                newContainerParameters.HostConfig.Binds = [];
                if ($scope.hostVolumeBindings.length > 1) {
                    var hostVolumeBindingsData = $scope.hostVolumeBindings;
                    var newHostVolumeBindingsData = [];
                    var Binds = [];
                    hostVolumeBindingsData.forEach(function (hostVolumeBinding) {
                        if (!isEmpty(hostVolumeBinding.value) && !isHostVolumeBindingDuplicated(newHostVolumeBindingsData, hostVolumeBinding)) {
                            var hostVolumeBindingString = hostVolumeBinding.value;
                            if (hostVolumeBinding["writable"] != true) {
                                hostVolumeBindingString += ":ro";
                            }
                            Binds.push(hostVolumeBindingString);
                            newHostVolumeBindingsData.push(hostVolumeBinding);
                        }
                    });
                    newContainerParameters.HostConfig.Binds = Binds;
                }

                if ($scope.volumeBindings.length > 1) {
                    var volumeBindingsData = $scope.volumeBindings;
                    var newVolumeBindingsData = [];
                    var Volumes = {};
                    volumeBindingsData.forEach(function (volumeBinding) {
                        if (!isEmpty(volumeBinding.value) && !isHostVolumeBindingDuplicated(newVolumeBindingsData, volumeBinding)) {
                            var volumeBindingString = volumeBinding.value;
                            if (volumeBinding["writable"] != true) {
                                volumeBindingString += ":ro";
                            }
                            Volumes[volumeBindingString] = {};
                            newVolumeBindingsData.push(volumeBinding);
                        }
                    });
                    newContainerParameters.Volumes = Volumes;
                }

                if ($scope.volumesFrom.length > 1) {
                    var volumesFromData = $scope.volumesFrom;
                    var newVolumesFrom = [];
                    var VolumesFrom = [];
                    volumesFromData.forEach(function (volumesFromEntry) {
                        if (!isEmpty(volumesFromEntry.containerId) && !isHostVolumeBindingDuplicated(newVolumesFrom, volumesFromEntry)) {
                            var volumesFromString = volumesFromEntry.containerId;
                            if (volumesFromEntry["writable"] != true) {
                                volumesFromString += ":ro";
                            }
                            VolumesFrom.push(volumesFromString)
                            newVolumesFrom.push(volumesFromEntry);
                        }
                    });
                    newContainerParameters.HostConfig.VolumesFrom = VolumesFrom;
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
                envVars.forEach(function (env) {
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
        $scope.validateContainerName = function () {
            var containerName = $scope.newContainerName;
            $scope.containerNameStatus = Helpers.hasValidContainerName(containerName) || isEmpty(containerName);
        };

        $scope.exposedPortValidator = function () {
            var exposedPorts = $scope.exposedPorts;
            var newExposedPorts = [];
            exposedPorts.forEach(function (port) {
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
            portBindings.forEach(function (portBinding) {
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
            hostVolumeBindings.forEach(function (hostVolumeBinding) {
                if (!isEmpty(hostVolumeBinding.value)) {
                    newHostVolumeBindings.push(hostVolumeBinding);
                }
            });
            newHostVolumeBindings.push({value: "", writable: true, status: ""});
            $scope.hostVolumeBindings = newHostVolumeBindings;
        };

        $scope.volumeBindingValidator = function () {
            var volumeBindings = $scope.volumeBindings;
            var newVolumeBindings = [];
            volumeBindings.forEach(function (volumeBinding) {
                if (!isEmpty(volumeBinding.value)) {
                    newVolumeBindings.push(volumeBinding);
                }
            });
            newVolumeBindings.push({value: "", writable: true, status: ""});
            $scope.volumeBindings = newVolumeBindings;
        };
        $scope.volumeFromValidator = function () {
            var volumesFrom = $scope.volumesFrom;
            var newVolumesFrom = [];
            volumesFrom.forEach(function (volumeFrom) {
                if (!isEmpty(volumeFrom.containerId)) {
                    newVolumesFrom.push(volumeFrom);
                }
            });
            newVolumesFrom.push({containerId: "", writable: true, status: ""});
            $scope.volumesFrom = newVolumesFrom;
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

        $scope.deleteVolumeFrom = function (index) {
            if ($scope.volumesFrom.length == 1) {
                $scope.volumesFrom[0].containerId = "";

            } else {
                $scope.deleteFromArray($scope.volumesFrom, index);
            }
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

        function isHostVolumeBindingDuplicated(newHostVolumeBindingsData, hostVolumeBinding) {
            var result = false;
            newHostVolumeBindingsData.forEach(function (newHostVolumeBinding) {
                if (newHostVolumeBinding.value == hostVolumeBinding.value) {
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