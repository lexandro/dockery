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
            $scope.selectAllImagesFlag = false;
            //
            var sort = {};
            sort.column = 'Id'
            sort.direction = 'ascending';
            sort.desc = false;
            $scope.sort = sort;
            //
            refreshImages();
            //
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

        $scope.changeSorting = function (column) {
            $scope.sort = Helpers.changeSorting($scope.sort, column);
        };

        $scope.removeSelectedImages = function () {
            $scope.images.forEach(function (image) {
                if (image.selected) {
                    Docker.images().remove({imageId: image.Id, force: 1}, {}, function () {
                            refreshImages();
                        }
                    );
                }
            });
        };

        $scope.switchSelectAllImagesFlag = function () {
            $scope.selectAllImagesFlag = !$scope.selectAllImagesFlag;
            setSelectedImages($scope.selectAllImagesFlag);
        };

        $scope.switchSelectedImage = function (image) {
            image.selected = !image.selected;
        };

        function refreshImages() {
            $scope.imageListing = true;
            $scope.selectAllImagesFlag = false;
            $scope.imageListingMessage = 'Loading image data';
            var images = Docker.images().query({showAllImagesFlag: $scope.showAllImagesFlag ? 1 : 0}, function () {
                var result = [];
                images.forEach(function (image) {
                    image.tagString = image.RepoTags.join(', ');
                    image.selected = false;
                    if ($scope.showUntaggedImagesFlag == true) {
                        result.push(image);
                    } else if (image.RepoTags[0] != "<none>:<none>") {
                        result.push(image);
                    }
                });
                $scope.imageListing = false;
                $scope.images = result;
            });
        }

        function setSelectedImages(selectedFlag) {
            $scope.images.forEach(function (image) {
                image.selected = selectedFlag;
            });
        }
    }]);