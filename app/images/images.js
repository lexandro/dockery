'use strict';

angular.module('images', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/images', {
            templateUrl: 'app/images/images.html',
            controller: 'ImagesCtrl'
        });
    }])

    .controller('ImagesCtrl', ['$rootScope', '$scope', '$location', 'Helpers', 'Docker', function ($rootScope, $scope, $location, Helpers, Docker) {
        if (Helpers.isEmpty($rootScope.host)) {
            $location.path('/hosts');
        } else {
            //
            var images = Docker.images().query(function () {
                $scope.images = images;
            });

            $scope.goImageDetails = function (path) {
                $location.path('/imageDetails/' + path);
            };
        }
    }])
;