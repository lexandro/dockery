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
        hosts = HostService.load();
        hosts.forEach(function (host) {
            host.status = false;
            host.editHostEnabled = false;
            if (hasOwnProperty.call($rootScope, 'hostUrl')) {
                host.selected = (host.url == $rootScope.hostUrl);
            }
            else {
                host.selected = false;
            }
        });
        $scope.hosts = hosts;

        function setHost(host) {
            $rootScope.hostUrl = host.url;
            host.lastConnected = new Date();
            HostService.save($scope.hosts);
        }


        function pingHost(host) {
            Docker.ping(host.url).get(function () {
                host.status = true;
            }, function () {
                host.status = false;
            });
        }

        $scope.checkContainersFor = function (host) {
            $rootScope.hostUrl = host.url;
            setHost(host);
            host.selected = true;
            host.lastConnected = new Date();
            $location.path('/containers');
        };

        $scope.checkHost = function (host) {
            setHost(host);
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
                host.selected = false;
                hosts.push(host);

                $scope.hosts = hosts;
                HostService.save($scope.hosts);
                pingHost(host);
            }
        };

        $scope.saveHost = function (host) {
            if (host.editHostEnabled) {
                host.name = host.editHostName;
                host.url = host.editHostUrl;
                HostService.save($scope.hosts);
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
            $scope.hosts = hosts;
            HostService.save($scope.hosts);

        };

        $scope.updateStatus = function () {
            $rootScope.tick = true;
            tick();
        };


        if (!hasOwnProperty.call($rootScope, 'tick') || $rootScope.tick == false) {
            $scope.updateStatus();
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
    }]);