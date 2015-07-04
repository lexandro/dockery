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
            $scope.searchImage = function () {
                console.log('Search with: ' + $scope.searchImageName);
                var searchResults = Docker.images().search({term: $scope.searchImageName}, function () {
                    console.log(JSON.stringify(searchResults));
                    $scope.searchResults = searchResults;
                });
            }
        }
    }]);