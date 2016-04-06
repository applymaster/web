/**
 * Created by startimes on 2015/11/16.
 */
'use strict';

var app = angular.module('teacherModule');
app.controller('TeacherCtrl', ['$rootScope', '$scope', 'rcServices', 'menuServices', '$location',
    function($rootScope, $scope, rcServices, menuServices, $location) {
        $scope.$on('$stateChangeSuccess', function() {
            $scope.tmenu = menuServices.init2($rootScope.$state.current.name, 1);
            $('body').css('background-image', '');
        });
    }
]);

app.controller('AccountCtrl', ['$rootScope', '$scope', 'rcServices',
    function($rootScope, $scope, rcServices){

    }
]);

app.controller('DiplomaCtrl', ['$rootScope', '$scope', 'rcServices',
    function($rootScope, $scope, rcServices){
        rcServices.query(1, $rootScope.$state.current.url).then(function(data) {
            $scope.diplomas = data;
        });
    }
]);

app.controller('CenterCtrl', ['$rootScope', '$scope', 'rcServices',
    function($rootScope, $scope, rcServices){
        $scope.disStatus = false;
        rcServices.query(1, $rootScope.$state.current.url).then(function(data) {
            $scope.single = [];
            for(var i = 0, count = 0; i < data.length; i++) {
                if(data[i]['type'] == 0) {
                    $scope.all = data[i];
                } else {
                    $scope.single.push(data[i]);
                    if(data[i]['avaliable']) {
                        count++;
                    }
                }
            }
            $scope.select = count == 11;
        });
        $scope.selectAll = function() {
            for(var i = 0; i < $scope.single.length; i++) {
                $scope.single[i]['avaliable'] = $scope.select;
            }
        };
        $scope.submit = function() {
            var postData = $scope.single;
            postData.push($scope.all);
            rcServices.post({
                'type': 1,
                'path': $rootScope.$state.current.url,
                'postData': postData,
                'sFunc': function(){},
                'eFunc': function(){}
            });
        };
    }
]);

app.controller('SecurityCtrl', ['$rootScope', '$scope', 'rcServices', 'formService',
    function($rootScope, $scope, rcServices, formService){
        $scope.teacher = {
            'oldpwd': '',
            'password': '',
            'confirm': ''
        };
        $scope.origData = angular.copy($scope.teacher);
        $scope.detectInput = function(inputName, idx) {
            formService.init($('#'+inputName));
            var errmsg = ['T_SECURITY_ERROR_OLDPWD', 'T_SECURITY_ERROR_PASSWORD', 'T_SECURITY_ERROR_CONFIRM'][idx];
            formService.detectInput($scope.frmSecurity[inputName].$invalid, errmsg, $('#'+inputName));
            if( idx != 0 && $scope.frmSecurity.confirm.$dirty && $scope.teacher.password != $scope.teacher.confirm) {
                formService.detectInput(true, 'T_SECURITY_ERROR_CONFIRM', $('#confirm'));
                $scope.frmSecurity.$setValidity('sameWithPwd', false);
            } else {
                $scope.frmSecurity.$setValidity('sameWithPwd', true);
            }
        };
        $scope.submitForm = function() {
            rcServices.post({
                'type': 1,
                'path': $rootScope.$state.current.url,
                'postData': $scope.teacher,
                'sFunc': function(){},
                'eFunc': function(){}
            })
        };
    }
]);

app.controller('OrderCtrl', ['$rootScope', '$scope', 'rcServices', 'rcServices', 'menuServices', 'ngDialog',
    function($rootScope, $scope, rcServices, menuServices, ngDialog) {
        rcServices.query(1, $rootScope.$state.current.url).then(function(data) {
            $scope.orders = data;
        });
        $scope.open = function(type, item) {
            switch(type){
                case 'price':
                ngDialog.open({
                    template: 'priceId',
                    data: item,
                    controller: ['$scope', function($scope){
                        $scope.save = function(){
                        };
                    }]
                })
                break;
            }
        }
    }
]);

app.controller('WalletCtrl', ['$rootScope', '$scope', 'rcServices', 'menuServices', '$translate',
    function($rootScope, $scope, rcServices, menuServices, $translate) {
        var init = function() {
            if($rootScope.$state.is('teacher.wallet')) {
                rcServices.get(1, $rootScope.$state.current.url).then(function(data) {
                    var num = data.amount + $translate.instant('COMMON_STR_DOLLOR');
                    $scope.content = [{
                        'title': 'T_WALLET_AMOUNT',
                        'value': num
                    }];
                });
            }
            if($rootScope.$state.is('teacher.income')) {
                rcServices.query(1, $rootScope.$state.current.url).then(function(data) {
                    $scope.content = data;
                    $scope.title = ['T_INCOME_TRADING_PARTY', 'T_INCOME_SERVICE_CONTENT', 'T_INCOME_AMOUNT', 'T_INCOME_DATE'];
                });
            }
            if($rootScope.$state.is('teacher.recommend')) {
                rcServices.query(1, $rootScope.$state.current.url).then(function(data) {
                    $scope.content = data;
                    $scope.title = ['T_RECOMMEND_PERSON', 'T_RECOMMEND_MATTERS', 'T_RECOMMEND_AMOUNT', 'T_RECOMMEND_ARRIVAL_DATE'];
                });
            }
        };
        init();
    }
]);

app.controller('CreditCtrl', ['$rootScope', '$scope', 'rcServices', 'menuServices', '$translate',
    function($rootScope, $scope, rcServices, menuServices, $translate) {
        if($rootScope.$state.is('teacher.assess')) {
            rcServices.get(1, $rootScope.$state.current.url).then(function(assessData) {
                $scope.content = [
                    {
                        'title': 'T_EVALUATION_COMPREHENSIVE_SCORE',
                        'value': assessData.score
                    },
                    {
                        'title': 'T_EVALUATION_SERVICE_QUALITY',
                        'value': assessData.quality
                    },
                    {
                        'title': 'T_EVALUATION_SERVICE_ATTITUDE',
                        'value': assessData.attitude
                    },
                    {
                        'title': 'T_EVALUATION_SERVICE_EFFICIENCY',
                        'value': assessData.efficiency
                    }
                ];
            });
        }
        if($rootScope.$state.is('teacher.point')) {
            rcServices.get(1, $rootScope.$state.current.url).then(function(pointData) {
                $scope.content = [
                    {
                        'title': 'T_POINT_MINE',
                        'value': pointData.mine
                    },
                    {
                        'title': 'T_POINT_TRANSACTION',
                        'value': pointData.transaction
                    },
                    {
                        'title': 'T_POINT_EVALUATION',
                        'value': pointData.evaluation
                    }
                ];
            });
        }
        if($rootScope.$state.is('teacher.star')) {
            rcServices.get(1, $rootScope.$state.current.url).then(function(starData) {
                $scope.content = [{
                    'title': 'T_STAR_MINE',
                    'level': starData.level,
                    'value': starData.star
                }];
            });
        }
    }
]);

app.controller('CalendarCtrl', ['$rootScope', '$scope', 'rcServices',
    function($rootScope, $scope, rcServices){

    }
]);

app.controller('TMeCtrl', ['$rootScope', '$scope', 'rcServices',
    function($rootScope, $scope, rcServices) {
        rcServices.get(1, $rootScope.$state.current.url).then(function(data) {
            $scope.info = data;
            var urlBg = 'url("' + data.bgimg + '")';
            $('body').css('background-image', urlBg);
        });
    }
]);
