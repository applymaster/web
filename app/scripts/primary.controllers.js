/**
 * Created by startimes on 2015/11/16.
 */
'use strict';
var priCtrl = angular.module('primaryModule');

priCtrl.controller('TopCtrl', ['$rootScope', '$scope', '$location', '$element', '$cookieStore', 'menuServices',
    function($rootScope, $scope, $location, $element, $cookieStore, menuServices) {
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

        var setUser = function(user) {
            $cookieStore.remove('user');
            $scope.user = $cookieStore.get('user') ? $cookieStore.get('user') : { 'type': 1, 'name': 'username' };
        };

        setUser();

        // For head page
        $scope.menus = menuServices.init1($scope.user.type);
    }
]);