angular.module('services', [])

    .factory('Containers', function ($resource, $rootScope) {
        return $resource($rootScope.host + '/containers/json', {
            query: {
                method: "GET",
                isArray: true
            },
            get: {
                method: "GET"
            }

        });
    })

    .factory('Images', function ($resource, $rootScope) {
        return $resource($rootScope.host + '/images/json', {
            query: {
                method: "GET",
                isArray: true
            }

        });
    });