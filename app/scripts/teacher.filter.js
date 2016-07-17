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
            str = ['T_ORDER_STATUS_0','T_ORDER_STATUS_1','T_ORDER_STATUS_2','T_ORDER_STATUS_3','T_ORDER_STATUS_4','T_ORDER_STATUS_5','T_ORDER_STATUS_6','T_ORDER_STATUS_7','T_ORDER_STATUS_8'][input];
            break;
        }
        return str;
    }
    return fomate;
});