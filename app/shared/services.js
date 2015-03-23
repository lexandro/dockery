angular.module('services', [])
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
        return $resource($rootScope.host + '/images/:imageId/json', {
            query: {
                method: "GET",
                isArray: true
            },
            get: {
                method: "GET",
                isArray: false
            }
        });
    });