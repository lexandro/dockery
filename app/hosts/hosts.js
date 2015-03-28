'use strict';

angular.module('hosts', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/hosts', {
            templateUrl: 'app/hosts/hosts.html',
            controller: 'HostCtrl'
        });
    }])
    .controller('HostCtrl', ['$rootScope', '$scope', '$location', '$timeout', 'HostService', 'Helpers', 'Docker', function ($rootScope, $scope, $location, $timeout, HostService, Helpers, Docker) {
        // do we have previously set ping interval?
        if (!hasOwnProperty.call($rootScope, 'lastPingInterval')) {
            // no, initialize
            $rootScope.lastPingInterval = 60000;
        }
        $scope.pingInterval = $rootScope.lastPingInterval;

        var hosts = [];
        try {
            hosts = HostService.load();
        } catch (err) {
            console.log("Error loading hosts data: " + err);
        }

        hosts.forEach(function (host) {
            host.status = false;
            host.editHostEnabled = false;
            host.selected = false;

            if (!Helpers.isEmpty($rootScope.hostUrl)) {
                host.selected = (host.url == $rootScope.hostUrl);
            }
        });
        $scope.hosts = hosts;

        function pingHost(host) {
            Docker.ping(host.url).get(function () {
                host.status = true;
                if (host.defaultConnection) {
                    selectHost(host);
                    host.selected = true;
                }
            }, function () {
                setDisabledHost(host);
            });
        }

        function selectHost(host) {
            host.selected = true;
            setActiveHost(host);
        }

        function saveHosts() {
            $scope.hosts = hosts;
            HostService.save($scope.hosts);
        }

        function setActiveHost(host) {
            $rootScope.hostUrl = host.url;
            host.lastConnected = new Date();
            saveHosts();
        }

        function setDisabledHost(host) {
            host.status = false;
            host.selected = false;
            if ($rootScope.hostUrl === host.url) {
                $rootScope.hostUrl = null;
            }
        }

        $scope.validateUrl = function (host) {
            var prefix = 'http://';
            if (host.url.substr(0, prefix.length) !== prefix) {
                host.url = prefix + host.url;
            }
            pingHost(host);
        };

        $scope.$on("$destroy", function () {
            $rootScope.tick = false;
        });


        function tick() {
            if ($rootScope.tick == true) {
                hosts.forEach(function (host) {
                    pingHost(host);

                });

                var interval = parseInt($scope.pingInterval);
                if (isNaN(interval) || interval < 1000) {
                    interval = $rootScope.lastPingInterval;
                } else {
                    $rootScope.lastPingInterval = $scope.pingInterval;
                }
                $timeout(tick, interval);
            }
        }


        $scope.setDefaultHost = function (host) {
            var originalState = host.defaultConnection;
            hosts.forEach(function (_host) {
                _host.defaultConnection = false;
            });
            host.defaultConnection = !originalState;
            saveHosts();
        };

        $scope.goContainers = function (host) {
            selectHost(host);
            $location.path('/containers');
        };

        $scope.goHostDetails = function (host) {
            selectHost(host);
            $location.path('/hostDetails');
        };

        $scope.addHost = function () {
            if (!Helpers.isEmpty($scope.newHostName) && !Helpers.isEmpty($scope.newHostUrl)) {
                var host = {};
                host.id = Helpers.newId();
                host.name = $scope.newHostName;
                host.url = $scope.newHostUrl;
                host.created = new Date();
                host.lastConnected = null;
                host.status = false;
                host.defaultConnection = false;
                host.selected = false;
                hosts.push(host);

                saveHosts();
                pingHost(host);
            }
        };

        $scope.saveHost = function (host) {
            if (host.editHostEnabled) {
                host.name = host.editHostName;
                host.url = host.editHostUrl;
                saveHosts();
            } else {
                host.editHostName = host.name;
                host.editHostUrl = host.url;
            }
            host.editHostEnabled = !host.editHostEnabled;
        };

        $scope.removeHost = function (deleteHost) {
            hosts.forEach(function (host, index, object) {
                if (host.id === deleteHost.id) {
                    object.splice(index, 1);
                }
            });
            saveHosts();
        };

        $scope.updateStatus = function () {
            $rootScope.tick = true;
            tick();
        };

        if (!hasOwnProperty.call($rootScope, 'tick') || $rootScope.tick == false) {
            $scope.updateStatus();
        }

    }])
;