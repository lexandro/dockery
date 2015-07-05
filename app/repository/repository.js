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
            $scope.searchImage = function () {
                $scope.repositorySearching = true;
                $scope.repositorySearchingError = false;
                $scope.searchText = $scope.searchImageName;
                var searchResults = Docker.images().search({term: $scope.searchText}, function () {
                    $scope.repositorySearching = false;
                    $scope.searchResults = searchResults;
                }, function (error) {
                    $scope.repositorySearching = false;
                    $scope.repositorySearchingError = true;
                    $scope.error = error;
                });


            }
            $scope.downloadImage = function (imageName) {
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
                            }
                        }
                    })
                    .done(function (things) {
                        console.log('there are', things.item.length, 'things to read');
                    });
                console.log('download ' + imageName);
            }
        }
    }]);