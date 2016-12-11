/**
 * Created by startimes on 2015/11/16.
 */
'use strict';

var app = angular.module('userModule', []);

app.controller('LoginCtrl', ['$scope', 'rcServices', '$cookies', 'formService', '$translate', '$cookieStore',
    function($scope, rcServices, $cookies, formService, $translate, $cookieStore) {
        $scope.user = {
            'email': '',
            'password': ''
        };
        $scope.detectEmail = function(inputName) {
            formService.init($('#' + inputName));
            formService.detectInput($scope.frmLogin[inputName].$invalid, 'LOGIN_EMAIL_ERROR', $('#' + inputName));
        };
        $scope.detectPwd = function(inputName) {
            formService.init($('#' + inputName));
            formService.detectInput($scope.frmLogin[inputName].$invalid, 'LOGIN_PASSWORD_ERROR', $('#' + inputName));
        };
        $scope.forgot = function() {
            rcServices.post({
                'type': 0,
                'path': 'forgot',
                'sFunc': function(){},
                'eFunc': function(){}
            });
        };
        $scope.login = function() {
            $scope.loginError = '';
            rcServices.post({
                'type': 0,
                'path': 'login',
                'postData': $scope.user,
                'sFunc': function(response) {
                    var user = response.user;
                    user.Authentication = response.accessToken.tokenString;
                    user.userId = response.accessToken.userId;
                    $cookies.putObject('user', user);
                    $scope.setUser();
                },
                'eFunc': function(resp) {
                    $scope.loginError = $translate.instant('ERR_12004');
                }
            });
        };
    }
]);

app.controller('RegisterCtrl', ['$rootScope', '$scope', '$cookies', 'rcServices', 'formService', '$translate',
    function($rootScope, $scope, $cookies, rcServices, formService, $translate) {
        $scope.user = {
            'email': '',
            'password': ''
        };
        $scope.detectEmail = function(inputName) {
            formService.init($('#' + inputName));
            formService.detectInput($scope.frmRegister[inputName].$invalid, 'LOGIN_EMAIL_ERROR', $('#' + inputName));
        };
        $scope.verifyEmail = function(inputName) {
            formService.init($('#' + inputName));
            formService.detectInput($scope.frmRegister[inputName].$invalid, 'LOGIN_EMAIL_ERROR', $('#' + inputName));
            if(formService.isError) {
                return false;
            }
            rcServices.post({
                'type': 0,
                'path': 'verifyEmail',
                'postData': { email: $scope.user.email },
                'sFunc': function(response) {
                    if (response.result) {
                        formService.detectInput(true, 'REGISTER_VERIFY_SUCCESS', $('#' + inputName));
                    } else {
                        formService.detectInput(true, 'REGISTER_VERIFY_ERROR', $('#' + inputName));
                    }
                },
                'eFunc': function(response) {
                    formService.detectInput(true, 'REGISTER_VERIFY_ERROR', $('#' + inputName));
                }
              });
        };
        $scope.detectPwd = function(inputName) {
            formService.init($('#' + inputName));
            formService.detectInput($scope.frmRegister[inputName].$invalid, 'LOGIN_PASSWORD_ERROR', $('#' + inputName));
        };
        $scope.login = function() {
            $scope.regError = '';
            rcServices.post({
                'type': 0,
                'path': 'login',
                'postData': $scope.user,
                'sFunc': function(response) {
                    var user = response.user;
                    user.Authentication = response.accessToken.tokenString;
                    user.userId = response.accessToken.userId;
                    $cookies.putObject('user', user);
                    $scope.setUser();
                },
                'eFunc': function(resp) {
                    $scope.regError = $translate.instant('ERR_12004');
                }
            });
        };
        $scope.register = function(email, password) {
            $scope.regError = '';
            var type = $rootScope.$state.params.type;
            var name = $scope.user.email.substr(0, $scope.user.email.indexOf('@'));
            rcServices.post({
                'type': 0,
                'path': 'register',
                'postData': { type: type, email: $scope.user.email, password: $scope.user.password },
                'sFunc': function(response) {
                    var user = response.user;
                    user.Authentication = response.accessToken.tokenString;
                    user.userId = response.accessToken.userId;
                    $cookies.putObject('user', user);
                    $scope.setUser();
                },
                'eFunc': function(response) {
                    var errmsg = 'ERR_'+response.code;
                    $scope.regError = $translate.instant(errmsg);
                }
            });
        };
    }
]);