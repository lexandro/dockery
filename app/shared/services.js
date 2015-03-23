angular.module('services', [])
    //.factory('Containers', function ($resource, $rootScope) {
    //    return {
    //        findAll: function () {
    //            $resource($rootScope.host + '/containers/json', {
    //                query: {
    //                    method: "GET",
    //                    isArray: true
    //                }
    //            });
    //        },
    //        findById: function () {
    //            $resource($rootScope.host + '/containers/:containerId/json', {
    //                findAll: {
    //                    method: "GET",
    //                    isArray: true
    //                }
    //            });
    //        }
    //    }
    //})
    .factory('Containers', ['$resource', '$rootScope',
        function ($resource, $rootScope) {
            return $resource($rootScope.host + '/containers/:containerId/json', {}, {
                query: {
                    method: 'GET',
                    isArray: true
                },
                get: {
                    method: 'GET',
                    isArray: false
                }
            });
        }])

    .factory('Images', function ($resource, $rootScope) {
        return $resource($rootScope.host + '/images/json', {
            query: {
                method: "GET",
                isArray: true
            }
        });
    });