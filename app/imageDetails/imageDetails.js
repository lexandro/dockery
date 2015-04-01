'use strict';

angular.module('imageDetails', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/imageDetails/:imageId', {
            templateUrl: 'app/imageDetails/imageDetails.html',
            controller: 'ImageDetailsCtrl'
        });
    }])

    .controller('ImageDetailsCtrl', ['$rootScope', '$scope', '$location', '$routeParams', 'Helpers', 'Docker', function ($rootScope, $scope, $location, $routeParams, Helpers, Docker) {
        if (Helpers.isEmpty($rootScope.hostUrl)) {
            $location.path('/hosts');
        } else {
            var imageDetails = Docker.images().get({imageId: $routeParams.imageId}, function () {
                $scope.imageDetails = imageDetails;
            });

            var imageHistoryList = Docker.images().history({imageId: $routeParams.imageId}, function () {
                $scope.imageHistoryList = imageHistoryList;
            });
        }
    }])
;