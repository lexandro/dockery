'use strict';

angular.module('pushImage', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/pushImage', {
            templateUrl: 'app/pushImage/pushImage.html',
            controller: 'PushImageCtrl'
        });
    }])
    .controller('PushImageCtrl', ['$scope', '$modalInstance', 'Helpers', 'Docker', 'imageDetails', function ($scope, $modalInstance, Helpers, Docker, imageDetails) {
        $scope.imageDetails = imageDetails;
        $scope.inputTag = imageDetails.RepoTags[0];
        console.log('************************');

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

        $scope.cancelPushImage = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);