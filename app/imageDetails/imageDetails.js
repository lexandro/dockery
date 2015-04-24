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
            $scope.imageDataLoading = true;
            $scope.imageDataLoadingMessage = 'Loading image data';
            var imageDetails = Docker.images().get({imageId: $routeParams.imageId}, function () {
                $scope.imageDataLoading = false;
                $scope.imageDetails = imageDetails;
                // converting the port listing map map to a more readable format
                if (imageDetails.Config.ExposedPorts) {
                    imageDetails.Config.ExposedPorts = Object.keys(imageDetails.Config.ExposedPorts).join(', ');
                }
            });

            var imageHistoryList = Docker.images().history({imageId: $routeParams.imageId}, function () {
                $scope.imageHistoryList = imageHistoryList;
            });
        }
    }])
;