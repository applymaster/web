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
            str = $translate.instant(['TS_ACCOUNT_DEGREE_0','TS_ACCOUNT_DEGREE_1','TS_ACCOUNT_DEGREE_2','TS_ACCOUNT_DEGREE_3'][input]);
            break;
            case 'gradute-status':
            str = $translate.instant({false:'SEARCH_GRADUATED_0', true: 'SEARCH_GRADUATED_1'}[input]);
            break;
            case 'service-type':
            str = $translate.instant(['T_CENTER_ALL','T_CENTER_SIN1','T_CENTER_SIN2','T_CENTER_SIN3','T_CENTER_SIN4','T_CENTER_SIN5','T_CENTER_SIN6','T_CENTER_SIN7','T_CENTER_SIN8','T_CENTER_SIN9','T_CENTER_SIN10','T_CENTER_SIN11'][input]);
            break;
        }
        return str;
    };
    return fomate;
}]);