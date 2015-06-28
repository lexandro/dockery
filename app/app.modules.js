'use strict';

// TODO add better logging

// Declare app level module which depends on views, and components
angular.module('dockery', [
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
        'imageDetails',
        'frapontillo.bootstrap-switch'],
    function ($provide) {
        // Prevent Angular from sniffing for the history API
        // since it's not supported in packaged apps.
        $provide.decorator('$window', function ($delegate) {
            $delegate.history = null;
            return $delegate;
        });
    })
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
    .directive('toggle', function () {
        // http://www.bootply.com/H4Zii7Mb6l
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                if (attrs.toggle == "tooltip") {
                    $(element).tooltip();
                }
                if (attrs.toggle == "popover") {
                    $(element).popover();
                }
            }
        };
    })
    .run(function ($rootScope) {
        $rootScope.appName = 'dockery';
        if (window.chrome && chrome.app && chrome.app.runtime) {
            $rootScope.chrome = true;
            chrome.app.window.current().maximize();
        } else {
            $rootScope.chrome = false;
        }
    }).config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/hosts'});
    }])
    .config([
        '$compileProvider',
        function ($compileProvider) {
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
        }
    ]);


