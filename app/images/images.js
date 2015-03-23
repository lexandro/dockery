'use strict';

angular.module('images', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/containers', {
            templateUrl: 'app/containers/containers.html',
            controller: 'ImagesCtrl'
        });
    }])

    .controller('ImagesCtrl', ['$rootScope', '$scope', '$location', 'Containers', function ($rootScope, $scope, $location, Containers) {
        var containers = Containers.query(function () {
            $scope.containers = containers;
            console.log("containers " + JSON.stringify(containers));
            console.log(    $rootScope.host );
        });
    }])
;