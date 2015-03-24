angular.module('services', [])
    .factory('Helpers', function () {
        return {
            isEmpty: function (obj) {
                var hasOwnProperty = Object.prototype.hasOwnProperty;
                // null and undefined are "empty"
                if (obj == null) return true;
                // Assume if it has a length property with a non-zero value
                // that that property is correct.
                if (obj.length > 0)    return false;
                if (obj.length === 0)  return true;
                // Otherwise, does it have any properties of its own?
                // Note that this doesn't handle
                // toString and valueOf enumeration bugs in IE < 9
                for (var key in obj) {
                    if (hasOwnProperty.call(obj, key)) return false;
                }
                return true;
            },
            hasTrueFlag: function hasTrueFlag(object, propertyName) {
                return !!(object.hasOwnProperty(propertyName) && object[propertyName] == true);
            }
        }
    })
    .factory('Docker', function ($resource, $rootScope) {
        return {
            containers: function () {
                return $resource($rootScope.hostUrl + '/containers/:containerId/json', {
                    query: {
                        method: "GET",
                        isArray: true
                    },
                    get: {
                        method: "GET",
                        isArray: false
                    }
                });
            }, images: function () {
                return $resource($rootScope.hostUrl + '/images/:imageId/json', {
                    query: {
                        method: "GET",
                        isArray: true
                    },
                    get: {
                        method: "GET",
                        isArray: false
                    }
                });
            },
            info: function () {
                return $resource($rootScope.hostUrl + '/info', {
                    get: {
                        method: "GET",
                        isArray: false
                    }
                });
            },
            version: function () {
                return $resource($rootScope.hostUrl + '/version', {
                    get: {
                        method: "GET",
                        isArray: false
                    }
                });
            },

            ping: function (hostUrl) {
                return $resource(hostUrl + '/_ping', {
                    get: {
                        method: "GET",
                        isArray: false
                    }
                });
            }
        }
    })
    .factory('HostService', ['$rootScope', function ($rootScope) {
        return {
            load: function () {
                var hosts = JSON.parse(localStorage.getItem("hosts"));
                hosts.forEach(function (host) {
                    if (host.default) {
                        $rootScope.hostUrl = host;
                    }
                });
                return hosts;
            },
            save: function (hosts) {
                localStorage.setItem("hosts", JSON.stringify(hosts));
            }
        }
    }]);


