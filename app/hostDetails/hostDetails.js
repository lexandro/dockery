'use strict';

angular.module('hostDetails', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/hostDetails', {
            templateUrl: 'app/hostDetails/hostDetails.html',
            controller: 'HostDetailsCtrl'
        });
    }])

    .controller('HostDetailsCtrl', ['$rootScope', '$scope', '$location', '$routeParams', 'Helpers', 'Docker', function ($rootScope, $scope, $location, $routeParams, Helpers, Docker) {
        if (Helpers.isEmpty($rootScope.host)) {
            $location.path('/hosts');
        } else {
            var dockerInfo = Docker.info().get(function () {
                console.log('Hostdetails enter ' + JSON.stringify(dockerInfo));
                dockerInfo.url = $rootScope.host;
                $scope.dockerInfo = dockerInfo;
                var versionInfo = Docker.version().get(function () {
                    $scope.versionInfo = versionInfo;
                });
            });

        }
    }])
;