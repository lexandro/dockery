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
    'images',
    'imageDetails'
])
    .run(function ($rootScope) {
    }).config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/hosts'});
    }]);


