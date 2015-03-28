'use strict';

angular.module('hostDetails', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/hostDetails', {
            templateUrl: 'app/hostDetails/hostDetails.html',
            controller: 'HostDetailsCtrl'
        });
    }])

    .controller('HostDetailsCtrl', ['$rootScope', '$scope', '$location', '$routeParams', 'Helpers', 'Docker', function ($rootScope, $scope, $location, $routeParams, Helpers, Docker) {
        if (Helpers.isEmpty($rootScope.hostUrl)) {
            $location.path('/hosts');
        } else {
            var dockerInfo = Docker.info().get(function () {
                dockerInfo.url = $rootScope.hostUrl;
                $scope.dockerInfo = dockerInfo;
                var versionInfo = Docker.version().get(function () {
                    $scope.versionInfo = versionInfo;
                });
            });

        }
    }])
;