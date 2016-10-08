/**
 * Created by startimes on 2015/11/16.
 */
'use strict';

var app = angular.module('studentModule', []);
app.controller('StudentCtrl', ['$rootScope', '$scope', 'rcServices', '$location', 'menuServices',
    function($rootScope, $scope, rcServices, $location, menuServices) {
        $scope.menus = menuServices.init1(2);
    }
]);
app.controller('SAccountEduCtrl', ['$rootScope', '$scope', 'rcServices', 'listService', '$translate', '$cookieStore', 'formService',
    function($rootScope, $scope, rcServices, listService, $translate, $cookieStore, formService) {
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
        // 学校list & 专业大类list & 小类list
        listService.getSchool().then(function(data) {
            $scope.edu_school = listService.convertFormat(data);
            listService.getMarjor().then(function(data) {
                $scope.edu_major = listService.convertFormat(data);
                listService.getSubMarjor($scope.edu_major[0]['value']).then(function(data) {
                    $scope.edu_subMajor = listService.convertFormat(data);
                    if($scope.ngDialogData.actType === 'add') {
                        $scope.eduItem = {
                            'degree': angular.copy($scope.degrees[0]['value']),
                            'school': angular.copy($scope.edu_school[0]['value']),
                            'major': angular.copy($scope.edu_major[0]['value']),
                            'subMajor': angular.copy($scope.edu_subMajor[0]['value']),
                            'start': new Date(),
                            'end': new Date,
                            'graduated': false
                        };
                    } else {
                        $scope.eduItem = angular.copy($scope.ngDialogData.eduItem);
                        $scope.eduItem.start = convertTime($scope.eduItem.start);
                        $scope.eduItem.end = $scope.eduItem.end ? convertTime($scope.eduItem.end) : $translate.instant('TS_ACCOUNT_GRADUATED_0');
                    }
                });
            });
        });
        var convertTime = function(str){
            return new Date(str);
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
        $scope.saveEdu = function() {
            if($scope.eduItem.graduated) {
                $scope.eduItem.end = null;
            }
            var postData = angular.copy($scope.eduItem);
            postData.userId = $cookieStore.get('user').userId;
            if($scope.ngDialogData.actType === 'add') {
                rcServices.put({
                    'type': 'education',
                    'postData': postData,
                    'sFunc': function(resp) {
                        location.reload();
                    },
                    'eFunc': function(resp) {
                        console.log('eFunc', resp);
                    }
                });
            } else {
                var id = angular.copy(postData.id);
                delete postData.id;
                rcServices.post({
                    'type': 'education',
                    'path': id.toString(),
                    'postData': postData,
                    'sFunc': function(resp) {
                        location.reload();
                    },
                    'eFunc': function(resp) {
                        console.log('eFunc', resp);
                    }
                });
            }
        };
    }
]);
app.controller('SAccountIntentCtrl', ['$rootScope', '$scope', 'rcServices', 'listService', '$translate', '$cookieStore', 'formService',
    function($rootScope, $scope, rcServices, listService, $translate, $cookieStore, formService) {
        // 学校list & 专业大类list & 小类list
        listService.getSchool().then(function(data) {
            $scope.intent_school = listService.convertFormat(data);
            listService.getMarjor().then(function(data) {
                $scope.intent_major = listService.convertFormat(data);
                listService.getSubMarjor($scope.intent_major[0]['value']).then(function(data) {
                    $scope.intent_subMajor = listService.convertFormat(data);
                    if($scope.ngDialogData.actType === 'add') {
                        $scope.intentItem = {
                            'school': angular.copy($scope.intent_school[0]['value']),
                            'major': angular.copy($scope.intent_major[0]['value']),
                            'subMajor': angular.copy($scope.intent_subMajor[0]['value'])
                        };
                    } else {
                        $scope.intentItem = angular.copy($scope.ngDialogData.intentItem);
                    }
                });
            });
        });
        $scope.saveEdu = function() {
            var postData = angular.copy($scope.intentItem);
            postData.userId = $cookieStore.get('user').userId;
            if($scope.ngDialogData.actType === 'add') {
                rcServices.put({
                    'type': 'intention',
                    'postData': postData,
                    'sFunc': function(resp) {
                        location.reload();
                    },
                    'eFunc': function(resp) {
                        console.log('eFunc', resp);
                    }
                });
            } else {
                var id = angular.copy(postData.id);
                delete postData.id;
                rcServices.post({
                    'type': 'intention',
                    'path': id.toString(),
                    'postData': postData,
                    'sFunc': function(resp) {
                        location.reload();
                    },
                    'eFunc': function(resp) {
                        console.log('eFunc', resp);
                    }
                });
            }
        };
    }
]);
app.controller('SAccountCtrl', ['$scope', '$translate', '$rootScope', 'rcServices', 'formService', 'listService', 'ngDialog',
    function($scope, $translate, $rootScope, rcServices, formService, listService, ngDialog) {
        // 初始化
        var init = function() {
            // 获取用户信息
            rcServices.get('user', 'studentInfo').then(function(data) {
                $scope.uInfo = data;
                // 我的联系方式 － province list & 城市list & 时区
                $scope.liveplace_province = listService.getProvince();
                $scope.uInfo.province = $scope.uInfo.province || $scope.liveplace_province[0]['value'];
                $scope.liveplace_city = listService.getCity($scope.uInfo.province);
                $scope.uInfo.city = $scope.uInfo.city || $scope.liveplace_city[0]['value'];
            });
            // 我的学历
            rcServices.queryAll('education', '').then(function(data) {
                $scope.education = data;
                listService.getSchool().then(function(data) {
                    var schools = listService.convertFormat(data);
                    for(var i = 0, j = 0; i < schools.length; i++) {
                        for(j = 0; j < $scope.education.length; j++ ){
                            if( schools[i]['value'] == $scope.education[j]['school']) {
                                $scope.education[j]['school-string'] = schools[i]['label'];
                            }
                        }
                    }
                });
                listService.getMarjor().then(function(data) {
                    var majors = listService.convertFormat(data);
                    for(var i = 0, j = 0; i < $scope.education.length; i++) {
                        for(j = 0; j < majors.length; j++ ){
                            if( majors[j]['value'] == $scope.education[i]['major']) {
                                $scope.education[i]['major-string'] = majors[j]['label'];
                            }
                        }
                    }
                });
                for(var i = 0, j = 0; i < $scope.education.length; i++) {
                    listService.getSubMarjor($scope.education[i]['major']).then(function(data) {
                        var subs = listService.convertFormat(data);
                        for(j = 0; j < subs.length; j++) {
                            if( subs[j]['value'] == $scope.education[i]['subMajor']) {
                                $scope.education[i]['subMajor-string'] = subs[j]['label'];
                            }
                        }
                    });
                }
            });
            // 留学意向
            rcServices.queryAll('intention', '').then(function(data) {
                $scope.intention = data;
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
                case 'referrerName':
                    if ($scope.uInfo.channel == 0) {
                        formService.detectInput($scope.frmAccount[inputName].$invalid, 'ERR_ACCOUNT_REFER_NAME', $('#' + inputName));
                    }
                    break;
                // 渠道 - 推荐人邮箱
                case 'referrerEmail':
                    if ($scope.uInfo.channel == 0) {
                        formService.detectInput($scope.frmAccount[inputName].$invalid, 'ERR_ACCOUNT_EMAIL', $('#' + inputName));
                    }
                    break;
            }
        };
        $scope.submit = function() {
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
                'type': 'user',
                'path': 'studentInfo',
                'postData': postData,
                'sFunc': function() {
                    location.reload();
                },
                'eFunc': function() {}
            });
        };
        // 我的学历
        $scope.eduAction = function(action, item) {
            switch (action) {
                case 'add':
                    ngDialog.open({
                        template: 'eduPage',
                        controller: 'SAccountEduCtrl',
                        showClose: false,
                        data: {actType: 'add'}
                    });
                    break;
                case 'delete':
                    rcServices.delete({
                        'type': 'education',
                        'id': item.id,
                        'sFunc': function() {
                            location.reload();
                        },
                        'eFunc': function() {}
                    });
                    break;
                case 'edit':
                    ngDialog.open({
                        template: 'eduPage',
                        controller: 'SAccountEduCtrl',
                        showClose: false,
                        data: {actType: 'edit', eduItem: item}
                    });
                    break;
            }
        };
        // 留学意向
        $scope.intentAction = function(action, item) {
            switch (action) {
                case 'add':
                    ngDialog.open({
                        template: 'intentPage',
                        controller: 'SAccountIntentCtrl',
                        showClose: false,
                        data: {actType: 'add'}
                    });
                    break;
                case 'delete':
                    rcServices.delete({
                        'type': 'intention',
                        'id': item.id,
                        'sFunc': function() {
                            location.reload();
                        },
                        'eFunc': function() {}
                    });
                    break;
                case 'edit':
                    ngDialog.open({
                        template: 'intentPage',
                        controller: 'SAccountIntentCtrl',
                        showClose: false,
                        data: {actType: 'edit', intentItem: item}
                    });
                    break;
            }
        };
        $scope.changeIMajor = function() {
            listService.getSubMarjor($scope.intention.major).then(function(data) {
                $scope.intent_subMajor = listService.convertFormat(data);
                $scope.intention.subMajor = $scope.intent_subMajor[0]['value'];
            });
        };
        // 我的联系方式
        $scope.changeLProvince = function() {
            listService.getCity($scope.uInfo.province).then(function(data) {
                $scope.liveplace_city = listService.convertFormat(data);
                $scope.uInfo.city = $scope.liveplace_city[0]['value'];
            });
        };
    }
]);
app.controller('SOrderCtrl', ['$rootScope', '$scope', 'rcServices', 'ngDialog', 'formService',
    function($rootScope, $scope, rcServices, ngDialog, formService) {
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
