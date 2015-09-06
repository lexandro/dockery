'use strict';

angular.module('repositoryLogin', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/repositoryLogin', {
            templateUrl: 'app/repositoryLogin/repositoryLogin.html',
            controller: 'RepositoriesCtrl'
        });
    }])

    .controller('RepositoryLoginCtrl', function ($scope, $modalInstance, items) {

        $scope.items = items;
        $scope.selected = {
            item: $scope.items[0]
        };

        $scope.ok = function () {
            $modalInstance.close($scope.selected.item);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });