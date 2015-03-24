'use strict';

angular.module('hosts', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/hosts', {
            templateUrl: 'app/hosts/hosts.html',
            controller: 'HostCtrl'
        });
    }])
    .controller('HostCtrl', ['$rootScope', '$scope', '$location', 'HostService', function ($rootScope, $scope, $location, HostService) {

        var hosts = [];
        var host = {};
        host.name = 'DH1';
        host.url = 'http://devft-docker-host-02.web.zooplus.de:2375';
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
        host3.url = 'http://devft-docker-host-01.web.zooplus.de:2375';
        host3.order = 1;
        hosts.push(host3);

        //console.log(JSON.stringify(hosts));
        HostService.save(hosts);

        var hosts = [];
        hosts = HostService.load();
        $scope.hosts = hosts;

        $scope.setHost = function (host) {
            $rootScope.host = host.url;
            host.lastConnected = new Date();
            console.log(JSON.stringify($scope.hosts));
            HostService.save($scope.hosts);
            $location.path('/containers');

        }

    }]);