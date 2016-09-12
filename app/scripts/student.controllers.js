/**
 * Created by startimes on 2015/11/16.
 */
'use strict';

var app = angular.module('studentModule', []);
app.controller('StudentCtrl', ['$rootScope', '$scope', 'rcServices', 'menuServices', '$location',
    function($rootScope, $scope, rcServices, menuServices, $location) {
        $scope.$on('$stateChangeSuccess', function() {
            $scope.smenu = menuServices.init2($rootScope.$state.current.name, 2);
        });
    }
]);
app.controller('SAccountCtrl', ['$scope', '$translate', '$rootScope', 'rcServices', 'menuServices', 'formService', 'listService',
    function($scope, $translate, $rootScope, rcServices, menuServices, formService, listService) {
        // 学位
        $scope.degrees = [{
            'value': 0,
            'label': $translate.instant('S_ACCOUNT_DEGREE_0')
        }, {
            'value': 1,
            'label': $translate.instant('S_ACCOUNT_DEGREE_1')
        }, {
            'value': 2,
            'label': $translate.instant('S_ACCOUNT_DEGREE_2')
        }, {
            'value': 3,
            'label': $translate.instant('S_ACCOUNT_DEGREE_3')
        }];
        // 国家
        $scope.countries = [{
            'value': 0,
            'label': $translate.instant('COUNTRY_AMERICA')
        }, {
            'value': 1,
            'label': $translate.instant('COUNTRY_CHINA')
        }];
        // 支付方式 - 银行卡 ｜ 支付宝
        $scope.selType = [{
            'value': 'card',
            'label': $translate.instant('S_ACCOUNT_BANK_CARD')
        }, {
            'value': 'alipay',
            'label': $translate.instant('S_ACCOUNT_ALIPAY')
        }];
        // 初始化
        var init = function(){
            // 获取用户信息
            rcServices.get(2, $rootScope.$state.current.url).then(function(data) {
                $scope.user = data;
                $scope.user.newedu = [];
                // 留学意向 & 我的学历 - 学校list & 专业大类list & 小类list
                listService.getSchool($scope.user.intention.country).then(function(data){
                    $scope.intent_school = listService.convertFormat(data);
                });
                listService.getSchool($scope.countries[0]['value']).then(function(data){
                    $scope.orig_school = listService.convertFormat(data);
                });
                listService.getMarjor().then(function(data){
                    $scope.intent_major = listService.convertFormat(data);
                    $scope.orig_major = angular.copy($scope.intent_major);
                });
                listService.getSubMarjor($scope.user.intention.major).then(function(data){
                    $scope.intent_profession = listService.convertFormat(data);
                    $scope.orig_profession = angular.copy($scope.intent_profession);
                });
                // 我的联系方式 － province list & 城市list & 时区
                listService.getProvince($scope.user.liveplace.country).then(function(data){
                    $scope.liveplace_province = listService.convertFormat(data);
                });
                listService.getCity($scope.user.liveplace.province).then(function(data){
                    $scope.liveplace_city = listService.convertFormat(data);
                    $scope.user.liveplace.timezone = getTimezone($scope.user.liveplace);
                });
            });
        };
        init();
        $scope.detectInput = function(type, inputName) {
            formService.init($('#' + inputName));
            switch(type) {
                // 我的身份
                case 'username':
                    formService.detectInput($scope.frmAccount[inputName].$invalid, 'ERR_PLZ_ENTER_NAME', $('#' + inputName));
                    break;
                // 渠道 - 推荐人姓名
                case 'way0name':
                    formService.detectInput($scope.frmAccount[inputName].$invalid, 'ERR_PLZ_ENTER_NAME');
                    break;
                // 渠道 - 推荐人邮箱
                case 'way0mail':
                    formService.detectInput($scope.frmAccount[inputName].$invalid, 'ERR_PLZ_ENTER_NAME');
                    break;
                // 渠道 - 学生会/社团
                case 'way1name':
                    formService.detectInput($scope.frmAccount[inputName].$invalid, 'ERR_PLZ_ENTER_NAME');
                    break;
            }
        };
        // 我的学历
        $scope.eduAction = function(action, item) {
            switch (action) {
                case 'add':
                    var newItem = {
                        'degree': angular.copy($scope.degrees[0]['value']),
                        'country': angular.copy($scope.countries[0]['value']),
                        'school': angular.copy($scope.orig_school[0]['value']),
                        'major': angular.copy($scope.orig_major[0]['value']),
                        'profession': angular.copy($scope.orig_profession[0]['value']),
                        'edu_school': angular.copy($scope.orig_school),
                        'edu_major': angular.copy($scope.orig_major),
                        'edu_profession': angular.copy($scope.orig_profession),
                        'time': null,
                        'graduated': 1,
                        'isEdit': true
                    };
                    $scope.user.newedu.push(newItem);
                    break;
                case 'delete':
                    var items = $scope.user.newedu;
                    $scope.user.newedu.splice(items.indexOf(item), 1);
                    break;
                case 'save':
                    var i;
                    item.isEdit = false;
                    for(i in $scope.orig_school) {
                        if($scope.orig_school[i]['value'] == item.school) {
                            item.scName = $scope.orig_school[i]['label'];
                            break;
                        }
                    }
                    for(i in $scope.orig_major) {
                        if($scope.orig_major[i]['value'] == item.school) {
                            item.mjName = $scope.orig_major[i]['label'];
                            break;
                        }
                    }
                    for(i in $scope.orig_profession) {
                        if($scope.orig_profession[i]['value'] == item.school) {
                            item.proName = $scope.orig_profession[i]['label'];
                            break;
                        }
                    }
                    break;
            }
        };
        $scope.changeECountry = function(item) {
            listService.getSchool(item.country).then(function(data){
                $scope.edu_school = listService.convertFormat(data);
                item.school = $scope.edu_school[0]['value'];
            });
        };
        $scope.changeEMajor = function(item) {
            // post major_list 值, 更改对应的 changeEMajor 菜单选项
            listService.getSubMarjor(item.major).then(function(data){
                $scope.edu_profession = listService.convertFormat(data);
                item.profession = item.edu_profession[0]['value'];
            });
        };
        $scope.detectTime = function(inputName) {
            formService.init($('#' + inputName));
            console.log('inputName:', inputName, '$scope.frmAccount:', $scope.frmAccount);
            formService.detectInput($scope.frmAccount[inputName].$invalid, 'ERR_PLZ_ENTER_TIME', $('#' + inputName));
        };
        // 留学意向
        $scope.changeICountry = function() {
            listService.getSchool($scope.user.intention.country).then(function(data){
                $scope.intent_school = listService.convertFormat(data);
                $scope.user.intention.school = $scope.intent_school[0]['value'];
            });
        };
        $scope.changeIMajor = function() {
            listService.getSubMarjor($scope.user.intention.major).then(function(data){
                $scope.intent_profession = listService.convertFormat(data);
                $scope.user.intention.profession = $scope.intent_profession[0]['value'];
            });
        };
        // 我的联系方式
        $scope.changeLCountry = function() {
            listService.getProvince($scope.user.liveplace.country).then(function(data){
                $scope.liveplace_province = listService.convertFormat(data);
                $scope.user.liveplace.province = $scope.liveplace_province[0]['value'];
                $scope.changeLProvince();
            });
        };
        $scope.changeLProvince = function() {
            listService.getCity($scope.user.liveplace.province).then(function(data){
                $scope.liveplace_city = listService.convertFormat(data);
                $scope.user.liveplace.city = $scope.liveplace_city[0]['value'];
                $scope.user.liveplace.timezone = getTimezone($scope.user.liveplace);
            });
        };
        // 我的账户
        $scope.cardAction = function(action, item) {
            switch (action) {
                case 'add':
                    var newItem = {
                        'isEdit': true,
                        'type': $scope.selType[0]['value'],
                        'numid': ''
                    };
                    $scope.user.account.push(newItem);
                    break;
                case 'delete':
                    var items = $scope.user.account;
                    $scope.user.account.splice(items.indexOf(item), 1);
                    break;
            }
        };
        var getTimezone = function(liveplace) {
            return '-';
        };
        // Post
        $scope.submit = function() {
            formService.init($('#' + inputName));
            var form = $scope.frmAccount;
            formService.detectInput(form.username.$invalid, 'ERR_PLZ_ENTER_NAME', $('#username'));
            // 我的学历
            for (var k = 0, inputName; k < $scope.user.newedu.length; k++) {
                if ($scope.user.newedu[k].isEdit) {
                    inputName = 'bt_save' + k;
                    formService.detectInput(true, 'ERR_PLZ_SAVE', $('#' + inputName));
                    inputName = 'time' + k;
                    formService.detectInput(form[inputName].$invalid, 'ERR_PLZ_ENTER_TIME', $('#' + inputName));
                }
            }
            // 成绩
            formService.detectInput($scope.user.score.has_sat && form.sat.$invalid, 'ERR_PLZ_ENTER_SCORE', $('#sat'));
            formService.detectInput($scope.user.score.has_toefl && form.toefl.$invalid, 'ERR_PLZ_ENTER_SCORE', $('#toefl'));
            formService.detectInput($scope.user.score.has_ielts && form.ielts.$invalid, 'ERR_PLZ_ENTER_SCORE', $('#ielts'));
            formService.detectInput($scope.user.score.has_gre && form.gre.$invalid, 'ERR_PLZ_ENTER_SCORE', $('#gre'));
            formService.detectInput($scope.user.score.has_gmat && form.gmat.$invalid, 'ERR_PLZ_ENTER_SCORE', $('#gmat'));
            // 渠道
            // Post
            var postData = angular.copy($scope.user);
            rcServices.post({
                'type': 2,
                'path': $rootScope.$state.current.url,
                'postData': postData,
                'sFunc': function() {},
                'eFunc': function() {}
            });
        };
    }
]);
app.controller('SOrderCtrl', ['$rootScope', '$scope', 'rcServices', 'menuServices', 'ngDialog', 'formService',
    function($rootScope, $scope, rcServices, menuServices, ngDialog, formService) {
        rcServices.query(2, $rootScope.$state.current.url + '/' + $rootScope.$stateParams.status).then(function(data) {
            $scope.orders = data;
        });

        $scope.open = function(type, item) {
            switch (type) {
                case 'price':
                    ngDialog.open({
                        template: 'modifyPrice',
                        data: item,
                        controller: ['$rootScope', '$scope', function($rootScope, $scope) {
                            $scope.entry = angular.copy($scope.ngDialogData.price);
                            $scope.entry.id = angular.copy($scope.ngDialogData.id);
                            $scope.detectInput = function(inputName) {
                                formService.init($('#' + inputName));
                                switch (inputName) {
                                    case 'price':
                                        formService.detectInput($scope.frmOrder[inputName].$invalid, 'TS_ORDER_ERROR_PRICE', $('#' + inputName));
                                        break;
                                    case 'reason':
                                        formService.detectInput($scope.frmOrder[inputName].$invalid, 'TS_ORDER_ERROR_REASON', $('#' + inputName));
                                        break;
                                }
                            };
                            $scope.submit = function() {
                                rcServices.post({
                                    'type': 2,
                                    'path': 'modifyPrice',
                                    'postData': $scope.entry,
                                    'sFunc': function(response) {
                                        if (response.success) {
                                            $scope.closeThisDialog();
                                        } else {
                                            $scope.loginError = response.msg;
                                        }
                                    },
                                    'eFunc': function(response) {
                                        $scope.loginError = response.data;
                                    }
                                });
                            };
                        }]
                    });
                    break;
            }
        };
    }
]);
app.controller('SWalletCtrl', ['$rootScope', '$scope', 'rcServices', '$translate',
    function($rootScope, $scope, rcServices, $translate) {
        rcServices.get(2, $rootScope.$state.current.url).then(function(data) {
            var num = data.amount + $translate.instant('COMMON_STR_DOLLOR');
            $scope.content = [{
                'title': 'T_WALLET_AMOUNT',
                'value': num
            }];
        });
    }
]);
