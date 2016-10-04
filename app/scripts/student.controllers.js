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
        // 初始化
        var init = function() {
            // 获取用户信息
            rcServices.get('student', 'studentInfo').then(function(data) {
                $scope.uInfo = data;
                // 我的联系方式 － province list & 城市list & 时区
                listService.getProvince($scope.uInfo.country).then(function(data) {
                    $scope.liveplace_province = listService.convertFormat(data);
                });
                listService.getCity($scope.uInfo.province).then(function(data) {
                    $scope.liveplace_city = listService.convertFormat(data);
                    $scope.uInfo.timezone = getTimezone($scope.uInfo);
                });
            });
            // 我的学历
            rcServices.queryAll('education', '').then(function(data) {
                $scope.education = data;
                // 添加新学历时先设置默认选项
                // 学校list & 专业大类list & 小类list
                $scope.newedu = [];
                listService.getSchool($scope.countries[0]['value']).then(function(data) {
                    $scope.orig_school = listService.convertFormat(data);
                });
                listService.getMarjor().then(function(data) {
                    $scope.orig_major = listService.convertFormat(data);
                });
                listService.getSubMarjor($scope.orig_major[0]['value']).then(function(data) {
                    $scope.orig_subMajor = listService.convertFormat(data);
                });
                $scope.newItem = {
                    'degree': angular.copy($scope.degrees[0]['value']),
                    'country': angular.copy($scope.countries[0]['value']),
                    'school': angular.copy($scope.orig_school[0]['value']),
                    'major': angular.copy($scope.orig_major[0]['value']),
                    'subMajor': angular.copy($scope.orig_subMajor[0]['value']),
                    'edu_school': angular.copy($scope.orig_school),
                    'edu_major': angular.copy($scope.orig_major),
                    'edu_subMajor': angular.copy($scope.orig_subMajor),
                    'time': null,
                    'graduated': 1,
                    'isEdit': true
                };
            });
            // 留学意向
            rcServices.queryAll('', 'intention').then(function(data) {
                $scope.intention = data;
                // 学校list & 专业大类list & 小类list
                listService.getSchool($scope.intention.country).then(function(data) {
                    $scope.intent_school = listService.convertFormat(data);
                });
                listService.getMarjor().then(function(data) {
                    $scope.intent_major = listService.convertFormat(data);
                });
                listService.getSubMarjor($scope.intention.major).then(function(data) {
                    $scope.intent_subMajor = listService.convertFormat(data);
                });
            });
            rcServices.get('student', $rootScope.$state.current.url).then(function(data) {
            });
        };
        init();
        // uInfo
        $scope.detectInput = function(type, inputName) {
            formService.init($('#' + inputName));
            switch (type) {
                // 我的身份
                case 'username':
                    formService.detectInput($scope.frmAccount[inputName].$invalid, 'ERR_ACCOUNT_NAME', $('#' + inputName));
                    break;
                    // 我的成绩
                case 'score':
                    formService.detectInput($scope.frmAccount[inputName].$invalid, 'ERR_ACCOUNT_SCORE', $('#' + inputName));
                    break;
                    // 渠道 - 推荐人姓名
                case 'way0name':
                    formService.detectInput($scope.frmAccount[inputName].$invalid, 'ERR_ACCOUNT_NAME', $('#' + inputName));
                    break;
                    // 渠道 - 推荐人邮箱
                case 'way0mail':
                    formService.detectInput($scope.frmAccount[inputName].$invalid, 'ERR_ACCOUNT_NAME', $('#' + inputName));
                    break;
                    // 渠道 - 学生会/社团
                case 'way1name':
                    formService.detectInput($scope.frmAccount[inputName].$invalid, 'ERR_ACCOUNT_NAME', $('#' + inputName));
                    break;
            }
        };
        $scope.submit = function() {
            formService.init($('#' + inputName));
            var form = $scope.frmAccount;
            // 我的身份
            $scope.detectInput('username', 'username');
            // 成绩
            $scope.detectInput('score', 'sat');
            $scope.detectInput('score', 'toefl');
            $scope.detectInput('score', 'ielts');
            $scope.detectInput('score', 'gre');
            $scope.detectInput('score', 'gmat');
            // Post
            var postData = angular.copy($scope.uInfo);
            rcServices.post({
                'type': 2,
                'path': $rootScope.$state.current.url,
                'postData': postData,
                'sFunc': function() {},
                'eFunc': function() {}
            });
        };
        // 我的学历
        $scope.eduAction = function(action, item) {
            switch (action) {
                case 'add':
                    $scope.newedu.push($scope.newItem);
                    break;
                case 'delete':
                    var items = $scope.newedu;
                    $scope.newedu.splice(items.indexOf(item), 1);
                    break;
                case 'save':
                    var i;
                    item.isEdit = false;
                    for (i in $scope.orig_school) {
                        if ($scope.orig_school[i]['value'] == item.school) {
                            item.scName = $scope.orig_school[i]['label'];
                            break;
                        }
                    }
                    for (i in $scope.orig_major) {
                        if ($scope.orig_major[i]['value'] == item.school) {
                            item.mjName = $scope.orig_major[i]['label'];
                            break;
                        }
                    }
                    for (i in $scope.orig_subMajor) {
                        if ($scope.orig_subMajor[i]['value'] == item.school) {
                            item.proName = $scope.orig_subMajor[i]['label'];
                            break;
                        }
                    }
                    break;
            }
        };
        $scope.changeECountry = function(item) {
            listService.getSchool(item.country).then(function(data) {
                $scope.edu_school = listService.convertFormat(data);
                item.school = $scope.edu_school[0]['value'];
            });
        };
        $scope.changeEMajor = function(item) {
            // post major_list 值, 更改对应的 changeEMajor 菜单选项
            listService.getSubMarjor(item.major).then(function(data) {
                $scope.edu_subMajor = listService.convertFormat(data);
                item.subMajor = item.edu_subMajor[0]['value'];
            });
        };
        $scope.detectTime = function(inputName) {
            formService.init($('#' + inputName));
            formService.detectInput($scope.frmAccount[inputName].$invalid, 'ERR_PLZ_ENTER_TIME', $('#' + inputName));
        };
        // 留学意向
        $scope.changeICountry = function() {
            listService.getSchool($scope.intention.country).then(function(data) {
                $scope.intent_school = listService.convertFormat(data);
                $scope.intention.school = $scope.intent_school[0]['value'];
            });
        };
        $scope.changeIMajor = function() {
            listService.getSubMarjor($scope.intention.major).then(function(data) {
                $scope.intent_subMajor = listService.convertFormat(data);
                $scope.intention.subMajor = $scope.intent_subMajor[0]['value'];
            });
        };
        // 我的联系方式
        $scope.changeLCountry = function() {
            listService.getProvince($scope.uInfo.country).then(function(data) {
                $scope.liveplace_province = listService.convertFormat(data);
                $scope.uInfo.province = $scope.liveplace_province[0]['value'];
                $scope.changeLProvince();
            });
        };
        $scope.changeLProvince = function() {
            listService.getCity($scope.uInfo.province).then(function(data) {
                $scope.liveplace_city = listService.convertFormat(data);
                $scope.uInfo.city = $scope.liveplace_city[0]['value'];
                $scope.uInfo.timezone = getTimezone($scope.uInfo);
            });
        };
        var getTimezone = function(liveplace) {
            return '-';
        };
        // 学位
        $scope.degrees = [{
            'value': 0,
            'label': $translate.instant('TS_ACCOUNT_DEGREE_0')
        }, {
            'value': 1,
            'label': $translate.instant('TS_ACCOUNT_DEGREE_1')
        }, {
            'value': 2,
            'label': $translate.instant('TS_ACCOUNT_DEGREE_2')
        }, {
            'value': 3,
            'label': $translate.instant('TS_ACCOUNT_DEGREE_3')
        }];
        // 国家
        $scope.countries = [{
            'value': 0,
            'label': $translate.instant('COUNTRY_AMERICA')
        }, {
            'value': 1,
            'label': $translate.instant('COUNTRY_CHINA')
        }];
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
                                        } else {}
                                    },
                                    'eFunc': function(response) {}
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
        rcServices.get('student', $rootScope.$state.current.url).then(function(data) {
            var num = data.amount + $translate.instant('COMMON_STR_DOLLOR');
            $scope.content = [{
                'title': 'T_WALLET_AMOUNT',
                'value': num
            }];
        });
    }
]);
app.controller('SearchCtrl', ['$scope', '$rootScope', 'listService', '$translate', 'rcServices',
    function($scope, $rootScope, listService, $translate, rcServices) {
        // Init
        $scope.countries = [{
            'value': 0,
            'label': $translate.instant('COUNTRY_AMERICA')
        }, {
            'value': 1,
            'label': $translate.instant('COUNTRY_CHINA')
        }];
        listService.getMarjor().then(function(data) {
            $scope.majors = listService.convertFormat(data);
            listService.getSubMarjor($scope.majors[0]['value']).then(function(data) {
                $scope.professions = listService.convertFormat(data);
                $scope.search = {
                    'query': {
                        'service': 'fullset',
                        'degree': 'bachelor',
                        'major': $scope.majors[0]['value'],
                        'profession': $scope.professions[0]['value'],
                        'gender': 'male',
                        'education': 'master0',
                        'liveplace': $scope.countries[0]['value'],
                        'sort': '1',
                    },
                    'offset': 0,
                    'size': 20,
                };
                $scope.submitCondition();
                rcServices.query(2, $rootScope.$state.current.url).then(function(data) {
                    $scope.teachers = data;
                });
            });
        });
        // droplist action
        $scope.changeMajor = function() {
            listService.getSubMarjor($scope.search.query.major).then(function(data) {
                $scope.professions = listService.convertFormat(data);
                $scope.search.query.profession = $scope.professions[0]['value'];
            });
        };
        // submit action
        $scope.submitCondition = function() {
            var postData = angular.copy($scope.search);
            rcServices.post({
                'type': 2,
                'path': $rootScope.$state.current.url,
                'postData': postData,
                'sFunc': function(data) {
                    $scope.teachers = data;
                },
                'eFunc': function() {}
            });
        };
        $scope.addToComparison = function() {
            srchConsultant.saveFavorate({
                postData: {
                    tid: this.teacher.tid
                },
                sFunc: function(data) {},
                eFunc: function(response) {}
            });
        };
    }
]);
app.controller('SCompareCtrl', ['$rootScope', '$scope', 'rcServices', '$translate',
    function($rootScope, $scope, rcServices, $translate) {
        rcServices.query(2, $rootScope.$state.current.url).then(function(data) {
            $scope.teachers = data;
        });
        $scope.postAction = function(item, type) {
            var postData = {
                'tid': item.tid,
                'action': item.action
            };
            postData.action[type] = !item.action[type];
            rcServices.post({
                'type': 2,
                'path': $rootScope.$state.current.url,
                'postData': postData,
                'sFunc': function(data) {
                    $scope.teachers = data;
                },
                'eFunc': function() {}
            });
        }
    }
]);
