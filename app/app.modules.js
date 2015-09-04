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
        'repository',
        'tasks',
        'events',
        'about',
        'frapontillo.bootstrap-switch'],
    function ($provide) {
        // Prevent Angular from sniffing for the history API
        // since it's not supported in packaged apps. Only in chrome
        $provide.decorator('$window', function ($delegate) {
            if (window.chrome && chrome.app && chrome.app.runtime) {
                $delegate.history = null;
            }
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
    }).directive("dockeryLoading", function ($animate) {
        return ({
            link: link,
            restrict: "C"
        });
        function link(scope, element, attributes) {
            $animate.leave(element.children().eq(1)).then(
                function cleanupAfterAnimation() {
                    element.remove();
                    scope = element = attributes = null;
                }
            );
        }
    }
).run(function ($rootScope) {
        $rootScope.appName = 'dockery';
        $rootScope.appVersion = '0.3.0';
        $rootScope.tasks = [];
        $rootScope.taskInProgress = false;
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


