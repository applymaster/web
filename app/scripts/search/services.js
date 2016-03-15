'use strict';
var services = angular.module('webApp.services', ['ngResource']);

services.factory('MajorInfo', function() {
    var majorStruct = [{
        'major': 'math',
        'profession': ['aaa', 'bbb', 'ccc']
    }, {
        'major': 'computer',
        'profession': ['eee', 'ddd', 'sss']
    }, {
        'major': 'education',
        'profession': ['www', 'qqq', 'bbb']
    }];
    var marjors = {
        get: function() {
            return majorStruct;
        },
        firstKid: function() {
            return majorStruct[0];
        },
        getProfession: function(m) {
            for (var ms in majorStruct) {
                if (majorStruct[ms]['major'] == m) {
                    return majorStruct[ms]['profession'];
                }
            }
            return [];
        }
    }
    return marjors;
});

services.factory('srchConsultant', ['$q', '$resource', function($q, $resource) {
    var datas = {
        query: {
            'bacherlor': false,
            'consultation': false,
            'corrections': false,
            'doctor': false,
            'essays': false,
            'fullset': false,
            'inputProfe': '',
            'major': 'math',
            'master': false,
            'others': false,
            'profession': false,
            'range-low': '222',
            'range-high': '3333',
            'star': false,
            'elite': false,
            'new': false,
            'sort': '1',
            'offset': 0,
            'size': 20,
        },
        teachers: {}
    };
    var sResource = $resource(
        '/api/consultant/:tid', {}, {
            save: {
                isArray: true,
                method: 'POST'
            }
        }
    );
    var fResource = $resource(
        '/api/consultant/favorate/:id', {}, {}
    );
    var conService = {
        getById: function(s) {
            //tId, sFunc, eFunc
            var defer = $q.defer();
            sResource.get(
                s.params ? s.params : null,
                function(data, headers) {
                    if (typeof s.sFunc == 'function') {
                        s.sFunc(data);
                    }
                    defer.resolve(data);
                },
                function(data, headers) {
                    if (typeof s.eFunc == 'function') {
                        s.eFunc(data);
                    }
                    defer.reject(data);
                });
            return defer.promise;
        },
        query: function(s) {
            //[Mark]this part is for test
            var sResource = $resource(
                '/api/consultant_1/:tid', {}, {
                    save: {
                        isArray: true,
                        method: 'POST'
                    }
                }
            );
            //sFunc, eFunc
            var defer = $q.defer();
            sResource.query(
                s.params ? s.params : null,
                function(data, headers) {
                    //success
                    if (typeof s.sFunc == 'function') {
                        s.sFunc(data);
                    }
                    defer.resolve(data);
                },
                function(data, headers) {
                    //fail
                    if (typeof s.eFunc == 'function') {
                        s.eFunc(data);
                    }
                    defer.reject(data);
                }
            );
            return defer.promise;
        },
        save: function(s) {
            //parameters, postData, sFunc, eFunc
            if (s.parameters) {
                sResource.save(s.parameters, s.postData, s.sFunc, s.eFunc);
            } else {
                sResource.save(s.postData, s.sFunc, s.eFunc);
            }
        },
        saveFavorate: function(s) {
            //parameters, postData, sFunc, eFunc
            if (s.parameters) {
                fResource.save(s.parameters, s.postData, s.sFunc, s.eFunc);
            } else {
                fResource.save(s.postData, s.sFunc, s.eFunc);
            }
        },
        initData: function() {
            var originData = datas;
            var sFunc = function(rsp) {
                originData.teachers = rsp;
            };
            this.query({
                'sFunc': sFunc
            });
            return originData;
        },
        initTeacherInfo: function() {
            var originData;
            var sFunc = function(rsp) {
                originData.teachers = rsp;
            };
            this.query({
                'sFunc': sFunc
            });
            return originData;
        }
    };
    return conService;
}]);
