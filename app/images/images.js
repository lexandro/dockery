'use strict';

angular.module('images', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/images', {
            templateUrl: 'app/images/images.html',
            controller: 'ImagesCtrl'
        });
    }])

    .controller('ImagesCtrl', ['$rootScope', '$scope', '$location', 'Images', function ($rootScope, $scope, $location, Images) {
        var images = Images.query(function () {
            $scope.images = images;
        });

        $scope.goImageDetails = function (path) {
            $location.path('/imageDetails/' + path);
        };
    }])
;