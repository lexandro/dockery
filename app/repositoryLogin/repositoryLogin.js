'use strict';

angular.module('repositoryLogin', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/repositoryLogin', {
            templateUrl: 'app/repositoryLogin/repositoryLogin.html',
            controller: 'RepositoriesCtrl'
        });
    }])
    .controller('RepositoryLoginCtrl', ['$scope', '$modalInstance', 'Helpers', 'Docker', function ($scope, $modalInstance, Helpers, Docker) {

        $scope.login = function () {
            var authConfig = {};
            authConfig.Username = $scope.Username;
            authConfig.Password = $scope.Password;
            authConfig.Auth = '';
            authConfig.Email = $scope.Email;
            if (Helpers.isEmpty($scope.ServerAddress)) {
                authConfig.ServerAddress = 'https://index.docker.io/v1';
            } else {
                authConfig.ServerAddress = $scope.ServerAddress;
            }
            toastr.options.escapeHtml = true;
            Docker.auth().post(null, authConfig, function () {
                    toastr["success"]('<strong>Logged into</strong> ' + authConfig.ServerAddress, 'Logged in');
                },
                function (err) {
                    toastr["error"]("<strong>Failed to log into:</strong><br/>" + authConfig.ServerAddress + '<br/><strong>Status:</strong><br/>' + err.data, 'Login failed');
                });
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);