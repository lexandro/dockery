'use strict';

angular.module('images', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/images', {
            templateUrl: 'app/images/images.html',
            controller: 'ImagesCtrl'
        });
    }])

    .controller('ImagesCtrl', ['$rootScope', '$scope', '$location', 'Helpers', 'Docker', function ($rootScope, $scope, $location, Helpers, Docker) {
        if (Helpers.isEmpty($rootScope.hostUrl)) {
            $location.path('/hosts');
        } else {
            //

            $scope.showAllImagesFlag = false;
            $scope.showUntaggedImagesFlag = false;
            refreshImages();


            $scope.switchShowAllFlag = function () {
                $scope.showAllImagesFlag = !$scope.showAllImagesFlag;
                refreshImages();
            };
            $scope.switchShowUntaggedFlag = function () {
                $scope.showUntaggedImagesFlag = !$scope.showUntaggedImagesFlag;
                refreshImages();
            };

            $scope.refreshImages = function () {
                refreshImages();
            };

            $scope.goImageDetails = function (path) {
                $location.path('/imageDetails/' + path);
            };
        }

        function refreshImages() {
            $scope.imageListing=true;
            $scope.imageListingMessage='Loading image data';
            var images = Docker.images().query({showAllImagesFlag: $scope.showAllImagesFlag ? 1 : 0}, function () {
                    var result = [];
                    images.forEach(function (image) {
                        if ($scope.showUntaggedImagesFlag == true) {
                            result.push(image);
                        } else if (image.RepoTags[0] != "<none>:<none>") {
                            result.push(image);
                        }
                    });
                    $scope.imageListing=false;
                    $scope.images = result;
                }
            );
        }


    }])
;