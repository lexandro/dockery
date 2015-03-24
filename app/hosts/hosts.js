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
            $rootScope.lastPingInterval = 5000;
        }
        $scope.pingInterval = $rootScope.lastPingInterval;


        var hosts = [];
        var host = {};
        host.name = 'DH1';
        host.url = 'http://devft-docker-hostUrl-02.web.zooplus.de:2375';
        host.created = new Date();
        host.lastConnected = null;
        host.order = 0;
        hosts.push(host);
        var host2 = {};
        host2.name = 'Home';
        host2.url = 'http://192.168.100.29:2375';
        host2.order = 1;
        hosts.push(host2);
        var host3 = {};
        host3.name = 'DH2';
        host3.url = 'http://devft-docker-hostUrl-01.web.zooplus.de:2375';
        host3.order = 1;
        hosts.push(host3);

        //console.log(JSON.stringify(hosts));
        HostService.save(hosts);

        var hosts = [];
        hosts = HostService.load();
        hosts.forEach(function (host) {
            host.status = false;
        });
        $scope.hosts = hosts;

        var setHost = function (host) {
            $rootScope.hostUrl = host.url;
            host.lastConnected = new Date();
            console.log(JSON.stringify($scope.hosts));
            HostService.save($scope.hosts);
        }
        $scope.checkContainersFor = function (host) {
            $rootScope.hostUrl = host.url;
            setHost(host);
            $location.path('/containers');
        }

        $scope.checkHost = function (host) {
            setHost(host);
            $location.path('/hostDetails');
        }


        if (!hasOwnProperty.call($rootScope, 'tick') || $rootScope.tick == false) {
            console.log('tickstart');
            $rootScope.tick = true;
            tick();
        } else {
            console.log('tickNEMstart');
        }
        $scope.$on("$destroy", function () {
            $rootScope.tick = false;
        });

        function tick() {
            if ($rootScope.tick == true) {
                console.log('ticklog in');
                hosts.forEach(function (host) {
                    Docker.ping(host.url).get(function (response) {
                        host.status = true;
                    }, function (response) {
                        host.status = false;
                    });

                });

                var interval = parseInt($scope.pingInterval);
                if (isNaN(interval) || interval < 1000) {
                    interval = $rootScope.lastPingInterval;
                } else {
                    $rootScope.lastPingInterval = $scope.pingInterval;
                }
                $timeout(tick, interval);
            }
        };
    }]);