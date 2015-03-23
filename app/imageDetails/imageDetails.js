'use strict';

angular.module('imageDetails', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/imageDetails/:imageId', {
            templateUrl: 'app/imageDetails/imageDetails.html',
            controller: 'ImageDetailsCtrl'
        });
    }])

    .controller('ImageDetailsCtrl', ['$rootScope', '$scope', '$location', '$routeParams', 'Images', function ($rootScope, $scope, $location, $routeParams, Images) {
        var imageDetails = Images.get({imageId: $routeParams.imageId}, function () {
            $scope.imageDetails = imageDetails;
        });
    }])
;