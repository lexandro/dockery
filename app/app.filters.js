'use strict';

angular.module('filters', [])
    .filter('bytes', function () {
        return function (bytes, precision) {
            if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
            if (bytes == 0 ) return '0';
            var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
                number = Math.floor(Math.log(bytes) / Math.log(1024));
            return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];
        }
    })
    .filter('shorten', function () {
        /*
         From:
         http://stackoverflow.com/questions/18095727/limit-the-length-of-a-string-with-angularjs
         Usage:

         {{some_text | cut:true:100:' ...'}}

         Options:

         wordwise (boolean) - if true, cut only by words bounds,
         max (integer) - max length of the text, cut to this number of chars,
         tail (string, default: ' …') - add this string to the input string if the string was cut.
         */

        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                    value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' ...');
        };
    });


