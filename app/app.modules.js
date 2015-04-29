'use strict';

// TODO add better logging

// Declare app level module which depends on views, and components
angular.module('dockermon', [
    'ngRoute',
    'ngResource',
    'jsonFormatter',
    'filters',
    'services',
    'hosts',
    'hostDetails',
    'containers',
    'containerDetails',
    'createContainer',
    'images',
    'imageDetails'
])
    .directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    })
    .run(function ($rootScope) {
    }).config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/hosts'});
    }]);


