angular.module('services', [])

    .factory('Containers', function ($resource, $rootScope) {
        return $resource($rootScope.host + '/containers/json', {});
    })
;