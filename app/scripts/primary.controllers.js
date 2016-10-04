/**
 * Created by startimes on 2015/11/16.
 */
'use strict';
var priCtrl = angular.module('primaryModule');

priCtrl.controller('TopCtrl', ['$rootScope', '$scope', '$location', '$element', '$cookieStore',
    function($rootScope, $scope, $location, $element, $cookieStore) {
        // $cookieStore.remove('user');
        console.log('cookieStore:', $cookieStore.get('user'));
        $scope.navTo = function(path, params) {
            if (params) {
                $location.path(path).search(params);
            } else {
                $location.path(path);
            }
        };

        $scope.back = function() {
            history.back();
        };

        $scope.setUser = function() {
            $scope.user = $cookieStore.get('user') ? $cookieStore.get('user') : { 'type': 0 };
            $scope.user.name = '未设置';
            if($scope.user.type == 1) {
                $location.path('/th');
            } else if($scope.user.type == 2) {
                if($scope.user.perfect) {
                    $location.path('/sh');
                } else {
                    $location.path('/student/account');
                }
            } else {
                $location.path('/');
            }
        };
    }
]);