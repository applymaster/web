/**
 * Created by startimes on 2015/11/16.
 */
'use strict';

var app = angular.module('webApp');
app.controller('TeacherCtrl', ['$rootScope', '$scope', 'rcServices', 'menuServices', '$location', 'ngDialog',
    function($rootScope, $scope, rcServices, menuServices, $location, ngDialog) {
        $scope.$on('$stateChangeSuccess', function(event) {
            $scope.tmenu = menuServices.init2($rootScope.$state.current.name, 1);
        });
    }
]);
app.controller('CreditCtrl', ['$rootScope', '$scope', 'rcServices', 'menuServices', '$translate',
    function($rootScope, $scope, rcServices, menuServices, $translate) {
        if($rootScope.$state.is('teacher.assess')) {
            rcServices.get(1, $rootScope.$state.current.url).then(function(assessData) {
                $scope.content = [
                    {
                        'title': 'T_EVALUATION_COMPREHENSIVE_SCORE',
                        'value': assessData.comprehensive_score
                    },
                    {
                        'title': 'T_EVALUATION_SERVICE_QUALITY',
                        'value': assessData.service_quality
                    },
                    {
                        'title': 'T_EVALUATION_SERVICE_ATTITUDE',
                        'value': assessData.service_attitude
                    },
                    {
                        'title': 'T_EVALUATION_SERVICE_EFFICIENCY',
                        'value': assessData.service_efficiency
                    }
                ];
                console.log('assessData:', assessData);
            });
        }
        if($rootScope.$state.is('teacher.point')) {
            rcServices.get(1, $rootScope.$state.current.url).then(function(pointData) {
                $scope.content = [
                    {
                        'title': 'T_POINT_MINE',
                        'value': pointData.point_mine
                    },
                    {
                        'title': 'T_POINT_TRANSACTION',
                        'value': pointData.point_transaction
                    },
                    {
                        'title': 'T_POINT_EVALUATION',
                        'value': pointData.point_evaluation
                    }
                ];
                console.log('pointData:', pointData);
            });
        }
        if($rootScope.$state.is('teacher.star')) {
            rcServices.get(1, $rootScope.$state.current.url).then(function(starData) {
                $scope.content = [{
                    'title': 'T_STAR_MINE',
                    'value': starData.level
                }];
                console.log('starData:', starData);
            });
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
                    }]
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