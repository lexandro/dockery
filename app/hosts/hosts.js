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
        var host = {};
        host.id = Math.random().toString(36).substr(2, 9);
        host.name = 'DH1';
        host.url = 'http://devft-docker-host-02.web.zooplus.de:2375';
        host.created = new Date();
        host.lastConnected = null;
        host.order = 0;
        hosts.push(host);
        var host2 = {};
        host2.id = Math.random().toString(36).substr(2, 9);
        host2.name = 'Home';
        host2.url = 'http://192.168.100.29:2375';
        host2.order = 1;
        hosts.push(host2);
        var host3 = {};
        host3.id = Math.random().toString(36).substr(2, 9);
        host3.name = 'DH2';
        host3.url = 'http://devft-docker-host-01.web.zooplus.de:2375';
        host3.order = 1;
        hosts.push(host3);

        HostService.save(hosts);

        var hosts = [];
        hosts = HostService.load();
        hosts.forEach(function (host) {
            host.status = false;
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
            $location.path('/containers');
        };

        $scope.checkHost = function (host) {
            setHost(host);
            $location.path('/hostDetails');
        };

        $scope.addHost = function () {
            var host = {};
            host.id = Math.random().toString(36).substr(2, 9);
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