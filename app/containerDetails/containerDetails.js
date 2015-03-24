'use strict';

angular.module('containerDetails', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/containerDetails/:containerId', {
            templateUrl: 'app/containerDetails/containerDetails.html',
            controller: 'ContainerDetailsCtrl'
        });
    }])

    .controller('ContainerDetailsCtrl', ['$rootScope', '$scope', '$location', '$routeParams', 'Helpers', 'Docker', function ($rootScope, $scope, $location, $routeParams, Helpers, Docker) {
        if (Helpers.isEmpty($rootScope.host)) {
            $location.path('/hosts');
        } else {
            var containerDetails = Docker.containers().get({containerId: $routeParams.containerId}, function () {
                $scope.containerDetails = containerDetails;
            });
        }
    }])
;