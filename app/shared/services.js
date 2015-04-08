angular.module('services', [])
    .factory('Helpers', function () {
        return {
            isEmpty: function (obj) {
                if (obj == null) return true;
                if (obj.length > 0)    return false;
                if (obj.length === 0)  return true;
                var hasOwnProperty = Object.prototype.hasOwnProperty;
                for (var key in obj) {
                    if (hasOwnProperty.call(obj, key)) return false;
                }
                return true;
            },
            hasTrueFlag: function (object, propertyName) {
                return !!(object.hasOwnProperty(propertyName) && object[propertyName] == true);
            },
            newId: function () {
                return Math.random().toString(36).substr(2, 9);
            }
        }
    })
    .factory('Docker', function ($resource, $rootScope) {
        return {
            containers: function () {
                return $resource($rootScope.hostUrl + '/containers/:containerId/json', null, {
                    query: {
                        method: "GET",
                        isArray: true
                    },
                    get: {
                        method: "GET",
                        isArray: false
                    },
                    diff: {
                        url: $rootScope.hostUrl + '/containers/:containerId/changes',
                        method: "GET",
                        isArray: true
                    },
                    top: {
                        url: $rootScope.hostUrl + '/containers/:containerId/top',
                        method: "GET",
                        isArray: false
                    }
                });
            }, images: function () {
                return $resource($rootScope.hostUrl + '/images/:imageId/json?all=:showAllImagesFlag', null, {
                    'query': {
                        method: "GET",
                        isArray: true
                    },
                    'get': {
                        method: "GET",
                        isArray: false
                    },
                    'history': {
                        method: "GET",
                        url: $rootScope.hostUrl + '/images/:imageId/history',
                        isArray: true

                    }
                });
            },
            info: function () {
                return $resource($rootScope.hostUrl + '/info', null, {
                    get: {
                        method: "GET",
                        isArray: false
                    }
                });
            },
            version: function () {
                return $resource($rootScope.hostUrl + '/version', null, {
                    get: {
                        method: "GET",
                        isArray: false
                    }
                });
            },

            ping: function (hostUrl) {
                return $resource(hostUrl + '/_ping', null, {
                    get: {
                        method: "GET",
                        isArray: false
                    }
                });
            }
        }
    })
    .factory('HostService', ['$rootScope', 'Helpers', function ($rootScope, Helpers) {
        return {
            load: function () {
                //localStorage.clear();
                var hosts = JSON.parse(localStorage.getItem("hosts"));
                if (Helpers.isEmpty(hosts)) {
                    hosts = [];
                } else {
                    hosts.forEach(function (host) {
                        if (host.default) {
                            $rootScope.hostUrl = host;
                        }
                    });
                }
                return hosts;
            },
            save: function (hosts) {
                localStorage.setItem("hosts", JSON.stringify(hosts));
            }
        }
    }]);


