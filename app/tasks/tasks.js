'use strict';

angular.module('tasks', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/tasks', {
            templateUrl: 'app/tasks/tasks.html',
            controller: 'TasksCtrl'
        });
    }])

    .controller('TasksCtrl', ['$rootScope', '$scope', '$location', '$routeParams', 'Helpers', 'Docker', function ($rootScope, $scope, $location, $routeParams, Helpers, Docker) {
        if (Helpers.isEmpty($rootScope.hostUrl)) {
            $location.path('/hosts');
        } else {
            $scope.clearFinishedTasks = function () {
                var tasks = $rootScope.tasks;
                var i = 0;
                while (i < tasks.length) {
                    if (tasks[i].finished) {
                        tasks.splice(i, 1);
                    } else {
                        i++;
                    }
                }
            };
        }
    }
    ]);