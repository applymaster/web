/**
 * Created by startimes on 2015/11/16.
 */
'use strict';
var tFilters = angular.module('teacherModule', ['ngDialog']);
tFilters.filter('tFilter', function($rootScope) {
    var fomate = function(input, expression, value) {
        var str;
        if (angular.isUndefined(input)) {
            return '';
        }
        switch (expression) {
            case 'order-status':
            str = ['TS_ORDER_STATUS_0','TS_ORDER_STATUS_1','TS_ORDER_STATUS_2','TS_ORDER_STATUS_3','TS_ORDER_STATUS_4','TS_ORDER_STATUS_5','TS_ORDER_STATUS_6','TS_ORDER_STATUS_7','TS_ORDER_STATUS_8'][input];
            break;
            case 'degree-status':
            str = $translate.instant(['TS_ACCOUNT_DEGREE_0','TS_ACCOUNT_DEGREE_1','TS_ACCOUNT_DEGREE_2','TS_ACCOUNT_DEGREE_3'][input]);
            break;
        }
        return str;
    }
    return fomate;
});