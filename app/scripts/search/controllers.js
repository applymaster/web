/**
 * Created by startimes on 2015/11/16.
 */
'use strict';

var app = angular.module('webApp');
app.controller('SearchCtrl', ['$scope', 'srchConsultant', 'MajorInfo',
    function($scope, srchConsultant, MajorInfo) {
        var init = function() {
            $scope.search = srchConsultant.initData();
            $scope.majors = MajorInfo.get();
            $scope.changeMajor();
        };
        $scope.changeMajor = function() {
            var m = $scope.search.query.major;
            $scope.professions = MajorInfo.getProfession(m);
            $scope.search.query.profession = $scope.professions[0];
        };
        $scope.submitCondition = function() {
            var postData = angular.copy($scope.search.query);
            srchConsultant.query({
                params: postData,
                sFunc: function(data) {
                    $scope.search.teachers = data;
                    $scope.show = {};
                },
                eFunc: function(response) {
                    $scope.loginError = response.data;
                }
            });
        };
        $scope.submitScreen = function() {
            var postData = angular.copy($scope.search.query);
            srchConsultant.query({
                params: postData,
                sFunc: function(data) {
                    $scope.search.teachers = data;
                },
                eFunc: function(response) {
                    $scope.loginError = response.data;
                }
            });
        };
        $scope.addToComparison = function() {
            srchConsultant.saveFavorate({
                postData: {
                    tid: this.teacher.tid
                },
                sFunc: function(data) {
                },
                eFunc: function(response) {
                    $scope.loginError = response.data;
                }
            });
        };
        $scope.detail = function() {
            $scope.navTo('/search/teacherInfo', {
                tid: this.teacher.tid
            });
        };
        init();
    }
]);


app.controller('TeacherInfoCtrl', ['$scope', 'srchConsultant', '$location',
    function($scope, srchConsultant, $location) {
        var init = function() {
            var initTeacherInfo = function(data) {
                $scope.teacher = data;
            };
            srchConsultant.getById({
                params: {
                    'tid': $location.search().tid,
                    'query': 1
                },
                sFunc: initTeacherInfo
            });
        }
        $scope.toPage = function(idx) {
            $scope.turnTo = idx;
            switch (idx) {
                case 1:
                    init();
                    break;
                case 2:
                    var initEval = function(data) {
                        $scope.evalutation = data;
                    };
                    srchConsultant.getById({
                        params: {
                            'tid': $location.search().tid,
                            'query': idx
                        },
                        sFunc: initEval
                    });
                    break;
            }
        };
        init();
    }
]);
