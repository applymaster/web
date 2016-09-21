/**
 * Created by startimes on 2015/11/16.
 */
'use strict';

var app = angular.module('userModule', []);

app.controller('LoginCtrl', ['$scope', 'rcServices', '$cookies', 'formService',
    function($scope, rcServices, $cookies, formService) {
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
            rcServices.post({
                'type': 0,
                'path': 'login',
                'postData': { email: $scope.user.email, password: md5($scope.user.password, $scope.user.email) },
                'sFunc': function(response) {
                    if (response.success) {
                        $cookies.putObject('user', response);
                        $scope.setUser(response);
                        $location.path('/home');
                    } else {
                    }
                },
                'eFunc': function(response) {
                    console.log('error code:', response.code);
                }
            });
        };
    }
]);

app.controller('RegisterCtrl', ['$rootScope', '$scope', '$cookies', 'rcServices', 'formService',
    function($rootScope, $scope, $cookies, rcServices, formService) {
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
            if(formService.isError) return false;
            rcServices.post({
                'type': 0,
                'path': 'verifyEmail',
                'postData': { email: $scope.user.email },
                'sFunc': function(response) {
                    if (response.success) {
                        $cookies.putObject('user', response.user);
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
            rcServices.post({
                'type': 0,
                'path': 'login',
                'postData': { email: $scope.user.email, password: md5($scope.user.password, $scope.user.email) },
                'sFunc': function(response) {
                    if (response.success) {
                        $cookies.putObject('user', response.user);
                        $scope.setUser(response.user);
                        $location.path('/home');
                    } else {
                    }
                },
                'eFunc': function(response) {
                }
            });
        };
        $scope.register = function(email, password) {
            rcServices.post({
                'type': 0,
                'path': 'register',
                'postData': { type: $rootScope.$state.params.type, email: $scope.user.email, password: md5($scope.user.password, $scope.user.email) },
                'sFunc': function(response) {
                    if (response.success) {
                        $cookies.putObject('user', response.user);
                        $scope.setUser(response.user);
                        $location.path('/home');
                    } else {
                    }
                },
                'eFunc': function(response) {
                }
            });
        };
    }
]);