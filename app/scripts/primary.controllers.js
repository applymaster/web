/**
 * Created by startimes on 2015/11/16.
 */
'use strict';
angular.module('webApp')
    .controller('TopCtrl', ['$rootScope', '$scope', '$location', '$element', '$cookieStore', 'menuServices',
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
                $scope.user = $cookieStore.get("user");
                console.log('test function to set user as: '
                    +['guest', 'teacher', 'student', 'admin'][$scope.user.type]);
            };

            //[Mark] set cookies for test
            $cookieStore.put("user", {
                name: "用户名",
                type: 1 // 0 - guest, 1 - teacher, 2 - student, 3 - admin
            });
            setUser();
        }
    ])
    .controller('HomeCtrl', ['$rootScope', '$scope', 'menuServices',
        function($rootScope, $scope, menuServices){
            $scope.menus = menuServices.init1($scope.user.type);
        }
    ]);
