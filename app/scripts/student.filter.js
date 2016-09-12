/**
 * Created by startimes on 2015/11/16.
 */
'use strict';
var sFilters = angular.module('studentModule');
sFilters.filter('sFilter', ['$rootScope', '$translate', function($rootScope, $translate) {
    var fomate = function(input, expression, value) {
        var str;
        if (angular.isUndefined(input)) {
            return '';
        }
        switch (expression) {
            case 'degree-status':
            str = $translate.instant(['S_ACCOUNT_DEGREE_0','S_ACCOUNT_DEGREE_1','S_ACCOUNT_DEGREE_2','S_ACCOUNT_DEGREE_3'][input]);
            break;
        }
        return str;
    }
    return fomate;
}]);