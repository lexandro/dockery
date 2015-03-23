'use strict';

angular.module('containerDetails', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/containerDetails/:containerId', {
            templateUrl: 'app/containerDetails/containerDetails.html',
            controller: 'ContainerDetailsCtrl'
        });
    }])

    .controller('ContainerDetailsCtrl', ['$rootScope', '$scope', '$location', '$routeParams', 'Containers', function ($rootScope, $scope, $location, $routeParams, Containers) {
        var containerDetails = Containers.get({containerId: $routeParams.containerId}, function () {
            $scope.containerDetails = containerDetails;
        });
    }])
;