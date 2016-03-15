/**
 * Created by startimes on 2015/11/16.
 */
'use strict';
var getType = function(type) {
    if (type == -1) return 'demo';
    return ['guest', 'teacher', 'student', 'admin'][type];
};

var services = angular.module('webApp.Services', ['ngResource']);

// http
services.factory('httpService', function($http, $q) {
    return {
        get: function(s) {
            //url, funcA, funcS, funcF
            var fileUrl = 'api/' + s.url;
            var deferred = $q.defer();
            $http.get(fileUrl).success(function(rsp) {
                switch (rsp.status) {
                    case 0:
                        //fali
                        if (typeof(s.funcF) == 'function') {
                            s.funcF(rsp);
                        }
                        break;
                    case 1:
                        //success
                        if (typeof(s.funcS) == 'function') {
                            s.funcS(rsp);
                        }
                        break;
                }
                if (typeof s.funcA == 'function') {
                    s.funcA(rsp);
                }
                deferred.resolve(rsp);
            }).error(function(rsp) {
                deferred.reject(rsp);
            });
            return deferred.promise;
        },
        post: function(s) {
            //url, data, funcF, funcS, funcA
            var deferred = $q.defer();
            $http.post('api/' + s.url, s.data).success(function(rsp) {
                switch (rsp.status) {
                    case 0:
                        //fail
                        if (typeof(s.funcF) == 'function') {
                            s.funcF(rsp);
                        }
                        break;
                    case 1:
                        //success
                        if (typeof(s.funcS) == 'function') {
                            s.funcS(rsp);
                        }
                        break;
                    default:
                        break;
                }
                if (typeof(s.funcA) == 'function') {
                    s.funcA(rsp);
                }
                deferred.resolve(rsp);
            }).error(function(rsp) {
                deferred.reject(rsp);
            });
            return deferred.promise;
        }
    };
});
// resource
services.factory('resourceObj', ['$resource', function($resource) {
    var service = {};
    service.init = function(type, path, byId) {
        if (byId)
            var url = '/api/' + type + '/' + path + '/:id';
        else
            var url = '/api/' + type + '/' + path + '.json';

        // 1. url : /api/teacher/account.json
        // url : /api/teacher/account/:id
        // 2. param : { tId: '@id' }
        // 3. other function
        return $resource(url, {
            id: '@id'
        }, {});
    }
    return service;
}]);
services.factory('rcServices', ['$q', 'resourceObj', function($q, resourceObj) {
    var service = {
        /*
         * @type: 0, 1, 2
         * @path: string, like 'account'
         * @id: string, like '123'
         */
        get: function(type, path, id) {
            var defer = $q.defer();
            var sFunc = function(data, headers) {
                console.log('rcServices data:', data)
                defer.resolve(data);
            };
            var eFunc = function(data, headers) {
                defer.reject(data);
            };
            var byId = id ? true : false;
            var tResource = resourceObj.init(getType(type), path, byId);
            if (byId)
                tResource.get({
                    'id': id
                }, sFunc, eFunc);
            else
                tResource.get(sFunc, eFunc);
            return defer.promise;
        },
        /*
         * @type: 0, 1, 2
         * @path: string, like 'account'
         * @id: string, like '123'
         */
        query: function(type, path, id) {
            var defer = $q.defer();

            var sFunc = function(data, headers) {
                console.log('rcServices data:', data)
                defer.resolve(data);
            };
            var eFunc = function(data, headers) {
                defer.reject(data);
            };
            var byId = id ? true : false;
            var tResource = resourceObj.init(getType(type), path, byId);
            if (byId)
                tResource.query({
                    'id': id
                }, sFunc, eFunc);
            else
                tResource.query(sFunc, eFunc);
            return defer.promise;
        }
    };
    return service;
}]);
// menu
services.factory('menuServices', function($rootScope) {
    var menuTable = {
        // id - 二级菜单列表
        // children - 三级菜单列表
        'guest': [{
            'id': 'login',
            'children': [{
                'id': 'login',
                'i18n': 'T_MENU_LOGIN',
                'link': 'guest.login'
            }]
        }],
        'teacher': [{ // 我的账户
            'id': 'account',
            'i18n': 'T_MENU_ACCOUNT',
            'link': 'teacher.account',
            'children': [{
                'id': 'account',
                'i18n': 'T_MENU_INFOMATION',
                'link': 'teacher.account'
            }, {
                'id': 'diploma',
                'i18n': 'T_MENU_DIPLOMA',
                'link': 'teacher.diploma'
            }, {
                'id': 'security',
                'i18n': 'T_MENU_SECURITY',
                'link': 'teacher.security'
            }]
        }, { // 我的产品中心
            'id': 'center',
            'i18n': 'T_MENU_CENTER',
            'link': 'teacher.center'
        }, { // 交易管理
            'id': 'deal',
            'i18n': 'T_MENU_ORDER_MAN',
            'link': 'teacher.order'
        }, { // 我的钱包
            'id': 'wallet',
            'children': [{
                'id': 'wallet',
                'i18n': 'T_MENU_WALLET',
                'link': 'teacher.wallet'
            }, {
                'id': 'income',
                'i18n': 'T_MENU_INCOME',
                'link': 'teacher.income'
            }, {
                'id': 'recommend',
                'i18n': 'T_MENU_RECOMMEND',
                'link': 'teacher.recommend'
            }]
        }, { // 我的信用评级
            'id': 'credit',
            'i18n': 'T_MENU_CREDIT',
            'link': 'teacher.assess',
            'children': [{
                'id': 'assess',
                'i18n': 'T_MENU_ASSESS',
                'link': 'teacher.assess'
            }, {
                'id': 'point',
                'i18n': 'T_MENU_POINT',
                'link': 'teacher.point'
            }, {
                'id': 'star',
                'i18n': 'T_MENU_STAR',
                'link': 'teacher.star'
            }]
        }, { // 日历
            'id': 'calendar',
            'i18n': 'T_MENU_CALENDAR',
            'link': 'teacher.calendar'
        }, { // 社区互动
            'id': 'community',
            'i18n': 'T_MENU_COMMUNITY',
            'link': 'teacher.community'
        }, { // 主页展示
            'id': 'main',
            'i18n': 'T_MENU_MAIN',
            'link': 'teacher.main'
        }],
        'student': [{
            'id': 'account',
            'i18n': 'T_MENU_INFOMATION',
            'link': 'student.account'
        }]
    };
    var _showFirst = function(type) {
        var i, fa, res = [];
        for (i = 0; i < menuTable[type].length; i++) {
            fa = menuTable[type][i];
            if (fa.i18n || typeof(fa.children) === 'undefined') {
                res.push(fa);
            } else {
                res.push(fa.children[0]);
            }
        }
        return res;
    };
    var _showChildren = function(link, type) {
        var i, j, fa;
        for (i = 0; i < menuTable[type].length; i++) {
            fa = menuTable[type][i];
            if (fa.children) {
                for (j = 0; j < fa.children.length; j++) {
                    if (link == fa.children[j].link)
                        return fa.children;
                }
            } else if (fa.link == link) {
                return fa;
            } else {
                continue;
            }
        }
    };
    var _findLink = function(id, type, menus) {
        var i, res;
        for (i = 0; i < menus.length; i++) {
            if (menus[i].id == id) {
                if (menus[i].link)
                    res = menus[i].link;
                else
                    res = menus[i].children[0].link;
            } else if (menus[i].children) {
                return _findLink(id, type, menus[i].children);
            }
            return res;
        }
    };
    return {
        init2: function(link, type) {
            /* 生成三级菜单 */
            /* link - ui-router state, type - user type*/
            return _showChildren(link, getType(type));
        },
        go: function(id, type) {
            var t = getType(type);
            var menus = menuTable[t];
            var link = _findLink(id, getType(type), menus);
            $rootScope.$state.go(link);
        },
        init1: function(type) {
            return _showFirst(getType(type));
        }
    };
});
