'use strict';

angular.module('imageDetails', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/imageDetails/:imageId', {
            templateUrl: 'app/imageDetails/imageDetails.html',
            controller: 'ImageDetailsCtrl'
        });
    }])

    .controller('ImageDetailsCtrl', ['$rootScope', '$scope', '$modal', '$location', '$routeParams', 'Helpers', 'Docker', function ($rootScope, $scope, $modal, $location, $routeParams, Helpers, Docker) {
        if (Helpers.isEmpty($rootScope.hostUrl)) {
            $location.path('/hosts');
        } else {
            $scope.imageDataLoading = true;
            $scope.imageDataLoadingMessage = 'Loading image data';
            var imageDetails = Docker.images().get({imageId: $routeParams.imageId}, function () {
                $scope.imageDataLoading = false;
                $scope.containerDataLoading = false;

                // converting the port listing map map to a more readable format
                if (imageDetails.Config.ExposedPorts) {
                    imageDetails.Config.ExposedPorts = Object.keys(imageDetails.Config.ExposedPorts).join(', ');
                }
                $scope.imageDetails = imageDetails;
                var images = Docker.images().query({showAllImagesFlag: 1}, function () {
                    images.forEach(function (image) {
                        if (image.Id == imageDetails.Id) {
                            imageDetails.RepoTags = image.RepoTags;
                            $scope.imageDetails = imageDetails;
                        }
                    });
                });
                $scope.containerDataLoading = true;
                var allContainers = Docker.containers().query({all: 1}, function () {
                    var imageContainers = [];
                    allContainers.forEach(function (container) {
                        var containerDetails = Docker.containers().get({containerId: container.Id}, function () {
                            //
                            if (containerDetails.Image == imageDetails.Id) {
                                var containerData = {};
                                console.log(containerDetails.Name);
                                containerData.Name = containerDetails.Name.substr(1);
                                containerData.Id = containerDetails.Id;
                                containerData.Privileged = containerDetails.HostConfig.Privileged
                                containerData.State = containerDetails.State
                                imageContainers.push(containerData);
                            }
                        });
                    });
                    $scope.containers = imageContainers;
                    $scope.containerDataLoading = false;
                });
            });


            var imageHistoryList = Docker.images().history({imageId: $routeParams.imageId}, function () {
                $scope.imageHistoryList = imageHistoryList;
            });

            $scope.pushImage = function () {

                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'app/pushImage/pushImage.html',
                    controller: 'PushImageCtrl',
                    size: 'lg',
                    resolve: {
                        imageDetails: function () {
                            return $scope.imageDetails;
                        }
                    }
                });

                modalInstance.result.then(function (selectedItem) {
                    $scope.selected = selectedItem;
                }, function () {
                    // dismiss
                });
            };
        }
    }])
;