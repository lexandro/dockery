'use strict';

angular.module('repository', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/repository', {
            templateUrl: 'app/repository/repository.html',
            controller: 'RepositoryCtrl'
        });
    }])

    .controller('RepositoryCtrl', ['$rootScope', '$scope', '$location', '$routeParams', 'Helpers', 'Docker', function ($rootScope, $scope, $location, $routeParams, Helpers, Docker) {
        if (Helpers.isEmpty($rootScope.hostUrl)) {
            $location.path('/hosts');
        } else {
            $scope.searchImageName = '';
            $scope.repositorySearching = false;
            $scope.repositorySearchingError = false;
            $scope.selectAllImagesFlag = false;
            $scope.searchImage = function () {
                $scope.repositorySearching = true;
                $scope.repositorySearchingError = false;
                $scope.searchText = $scope.searchImageName;
                var searchResults = Docker.images().search({term: $scope.searchText}, function () {
                    $scope.repositorySearching = false;
                    $scope.searchResults = searchResults;
                    searchResults.forEach(function (searchResult) {
                        searchResults.selected = false;
                    });

                }, function (error) {
                    $scope.repositorySearching = false;
                    $scope.repositorySearchingError = true;
                    $scope.error = error;
                });


            };
            $scope.downloadImage = function (imageName) {
                toastr["info"]('Pulling image ' + imageName, 'Check the progress on tasks');
                if (imageName == 'lexandro/echo-repeat') {
                    oboe({
                        url: 'http://localhost:2375/images/create?fromImage=lexandro/echo-repeat&tag=latest',
                        method: 'POST'
                    })
                        .node('*', function (item) {
                            if (typeof item == "object" && !Helpers.isEmpty(item) && !Helpers.isEmpty(item.status)) {
                                console.log("Received: " + JSON.stringify(item));
                                if (item.status === "Status: Downloaded newer image for lexandro/echo-repeat:latest") {
                                    console.log('Finito');
                                    this.abort();
                                } else {
                                    var tasks = $rootScope.tasks;
                                    var pos = -1;
                                    tasks.forEach(function (task, index) {
                                        if (task.id == item.id) {
                                            pos = index;
                                        }
                                    });
                                    if (!Helpers.isEmpty(item.id) && pos == -1) {
                                        tasks.push(item);
                                    } else {
                                        tasks[pos] = item;
                                    }
                                    $rootScope.tasks = tasks;
                                    $rootScope.$apply();

                                }
                            }
                        })
                        .done(function (things) {
                            console.log('there are', things.item.length, 'things to read');
                        });
                }
                console.log('download ' + imageName);
            };

            $scope.downloadSelectedImages = function () {
                var searchResults = $scope.searchResults;
                searchResults.forEach(function (searchResult) {
                    if (searchResult.selected) {
                        console.log(JSON.stringify(searchResult));
                        $scope.downloadImage(searchResult.name);
                    }
                });
            };

            $scope.switchSelectAllImagesFlag = function () {
                $scope.selectAllImagesFlag = !$scope.selectAllImagesFlag;
                var searchResults = $scope.searchResults;
                searchResults.forEach(function (searchResult) {
                    searchResult.selected = $scope.selectAllImagesFlag;
                });
                $scope.searchResults = searchResults;
            };

            $scope.selectImageFlag = function (image) {
                image.selected = !image.selected;
                $scope.selectAllImagesFlag = false;
            }
        }
    }]);