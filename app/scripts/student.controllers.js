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
app.controller('SAccountCtrl', ['$scope', '$translate', '$rootScope', 'rcServices', 'menuServices', 'formService',
    function($scope, $translate, $rootScope, rcServices, menuServices, formService) {
        /* 测试OK */
        $scope.selType = [{
            'value': 'card',
            'label': $translate.instant('S_ACCOUNT_BANK_CARD')
        }, {
            'value': 'alipay',
            'label': $translate.instant('S_ACCOUNT_ALIPAY')
        }];
        $scope.selDegree = [{
            'value': '',
            'label': ''
        }, {
            'value': '',
            'label': ''
        }, {
            'value': '',
            'label': ''
        }];
        rcServices.get(2, $rootScope.$state.current.url).then(function(data) {
            $scope.user = data;
            $scope.user.newedu = [];
        });
        $scope.eduAction = function(action, item) {
            switch (action) {
                case 'add':
                    var newItem = {
                        'degree': $scope.selDegree[0]['value'],
                        'school': $scope.school_list[0]['value'],
                        'major_list': angular.copy($scope.major_list),
                        'profession_list': angular.copy($scope.profession_list),
                        'major': $scope.major_list[0]['value'],
                        'profession': $scope.profession_list[0]['value'],
                        'time': null
                    };
                    $scope.user.newedu.push(newItem);
                    break;
                case 'delete':
                    var items = $scope.user.newedu;
                    $scope.user.newedu.splice(items.indexOf(item), 1);
                    break;
            }
        };
        $scope.cardAction = function(action, item) {
            switch (action) {
                case 'add':
                    var newItem = {
                        'isEdit': true,
                        'type': $scope.selType[0]['value'],
                        'id': ''
                    };
                    $scope.user.account.push(newItem);
                    break;
                case 'delete':
                    var items = $scope.user.account;
                    $scope.user.account.splice(items.indexOf(item), 1);
                    break;
            }
        };
        /* 未测试 */
        // web服务器获取
        $scope.major_list = [{
            'value': '',
            'label': ''
        }, {
            'value': '',
            'label': ''
        }, {
            'value': '',
            'label': ''
        }];
        $scope.profession_list = [{
            'value': '',
            'label': ''
        }, {
            'value': '',
            'label': ''
        }, {
            'value': '',
            'label': ''
        }];
        $scope.intent_school = [{
            'value': '',
            'label': ''
        }, {
            'value': '',
            'label': ''
        }, {
            'value': '',
            'label': ''
        }];
        $scope.school_list = [{
            'value': '',
            'label': ''
        }, {
            'value': '',
            'label': ''
        }, {
            'value': '',
            'label': ''
        }];
        $scope.country_list = [{
            'value': '',
            'label': ''
        }];
        $scope.province_list = [{
            'value': '',
            'label': ''
        }];
        $scope.city_list = [{
            'value': '',
            'label': ''
        }];
        // JS 初始化
        $scope.intent_major = angular.copy($scope.major_list);
        $scope.intent_profession = angular.copy($scope.profession_list);
        $scope.detectInput = function(inputName) {
            formService.init($('#' + inputName));
            switch (inputName) {
                // 我的身份
                case 'realname':
                    formService.detectInput($scope.frmAccount[inputName].$invalid, 'ERR_PLZ_ENTER_NAME', $('#' + inputName));
                    break;
            }
            console.log(formService.isError);
        };
        // 我的学历
        $scope.changeMajor = function(item) {
            // post major_list 值, 更改对应的 profession_list 菜单选项
            item.profession_list = menuServices.getProfession(item.major);
            item.profession = item.profession_list[0]['value'];
        };
        $scope.detectTime = function(inputName) {
            formService.init($('#' + inputName));
            formService.detectInput($scope.frmAccount[inputName].$invalid, 'ERR_PLZ_ENTER_TIME', $('#' + inputName));
        };
        // 留学意向
        $scope.changeIMajor = function() {
            // post major 值, 更改对应的 intent_profession 菜单选项
            $scope.intent_profession = menuServices.getProfession($scope.user.intention.major);
            $scope.user.intention.profession = $scope.intent_profession[0]['value'];
        };
        // 我的联系方式
        $scope.changeCountry = function() {
            // post country 值, 更改对应的 profession_list 菜单选项
            $scope.province_list = menuServices.getProvince($scope.user.liveplace.country);
            $scope.user.liveplace.province = $scope.province_list[0]['value'];
            $scope.city_list = menuServices.getCity($scope.user.liveplace.province);
            $scope.user.liveplace.city = $scope.city_list[0]['value'];
            // post liveplace 值, 获取时区
            $scope.user.liveplace.timezone = menuServices.getTimezone($scope.user.liveplace);
        };
        $scope.changeProvince = function() {
            $scope.city_list = menuServices.getCity($scope.user.liveplace.province);
            $scope.user.liveplace.city = $scope.city_list[0]['value'];
            // post liveplace 值, 获取时区
            $scope.user.liveplace.timezone = menuServices.getTimezone($scope.user.liveplace);
        };
        // 渠道
        $scope.detectWay = function(inputName, idx) {
            formService.init($('#' + inputName));
            var errmsg = ['ERR_INVALID_MINIMUM_RATE', 'ERR_INVALID_MAXIMUM_RATE', 'ERR_INVALID_MAXIMUM_RATE'][idx];
            formService.detectInput($scope.frmWanQueuing[inputName].$invalid, errmsg);
        };
        // Post
        $scope.submit = function() {
            formService.init($('#' + inputName));
            var form = $scope.frmAccount;
            formService.detectInput(form.realname.$invalid, 'ERR_PLZ_ENTER_NAME', $('#realname'));
            // 我的学历
            for (var k = 0, inputName; k < $scope.user.newedu.length; k++) {
                if ($scope.user.newedu[k].isEdit) {
                    inputName = 'bt_save' + k;
                    formService.detectInput(true, '请保存', $('#' + inputName));
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
app.controller('SWalletCtrl', ['$rootScope', '$scope', 'rcServices', 'droplistSrc', '$translate',
    function($rootScope, $scope, rcServices, droplistSrc, $translate) {
        rcServices.get(2, $rootScope.$state.current.url).then(function(data) {
            var num = data.amount + $translate.instant('COMMON_STR_DOLLOR');
            $scope.content = [{
                'title': 'T_WALLET_AMOUNT',
                'value': num
            }];
        });
        droplistSrc.getMarjor();
        droplistSrc.getSubMarjor(1);
    }
]);
