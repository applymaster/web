'use strict';

/**
 * @ngdoc overview
 * @name webApp
 * @description
 * # webApp
 *
 * Main module of the application.
 */

angular.module('webApp', [
        'ngAnimate',
        'ngCookies',
        'ngSanitize',
        'ngTouch',
        'ui.router',
        'pascalprecht.translate',
        'ngDialog',
        'angularFileUpload',
        'primaryModule',
        'userModule',
        'studentModule',
        'teacherModule'
    ])
    // language
    .config(function($translateProvider) {
        $translateProvider.useStaticFilesLoader({
            files: [{
                prefix: '../i18n/',
                suffix: '.json'
            }]
        });
        $translateProvider.registerAvailableLanguageKeys(['en', 'zh'], {
            'en_US': 'en',
            'en_UK': 'en',
            'zh_CN': 'zh'
        });
        //set preferred lang
        $translateProvider.preferredLanguage('zh');
        //auto determine preferred lang
        $translateProvider.determinePreferredLanguage();
        //when can not determine lang, choose en lang.
        $translateProvider.fallbackLanguage('zh');
    })
    // ui-router
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

        $stateProvider
        /* 游客 */
        .state('index', {
            url: '/index',
            templateUrl: '/views/user/index.html'
        })
        .state('login', {
            url: '/login',
            templateUrl: '/views/user/login.html',
            controller: 'LoginCtrl'
        })
        .state('register', {
            url: '/register?type',
            templateUrl: '/views/user/register.html',
            controller: 'RegisterCtrl'
        })
        /* 顾问 */
        .state('teacherme', {
            url: '/myself',
            templateUrl: '/views/teacher/myself.html',
            controller: 'TMeCtrl'
        })
        .state('th', {
            url: '/th',
            templateUrl: '/views/teacher/home.html',
            controller: 'TeacherCtrl'
        })
        .state('teacher', {
            //abstract: true 表明此状态不能被显性激活，只能被子状态隐性激活
            abstract: true,
            url: '/teacher',
            templateUrl: '/views/teacher/teacher.html',
            controller: 'TeacherCtrl'
        })
        .state('teacher.account', {
            url: '/account',
            views: {
                'viewT': {
                    templateUrl: '/views/teacher/account.html',
                    controller: 'TAccountCtrl'
                }
            }
        })
        .state('teacher.diploma', {
            url: '/diploma',
            views: {
                'viewT': {
                    templateUrl: '/views/teacher/diploma.html',
                    controller: 'DiplomaCtrl'
                }
            }
        })
        .state('teacher.security', {
            url: '/security',
            views: {
                'viewT': {
                    templateUrl: '/views/teacher/security.html',
                    controller: 'SecurityCtrl'
                }
            }
        })
        .state('teacher.center', {
            url: '/center',
            views: {
                'viewT': {
                    templateUrl: '/views/teacher/center.html',
                    controller: 'CenterCtrl'
                }
            }
        })
        .state('teacher.order', {
            url: '/order/:status',
            views: {
                'viewT': {
                    templateUrl: '/views/teacher/order.html',
                    controller: 'OrderCtrl'
                }
            }
        })
        .state('teacher.wallet', {
            url: '/wallet',
            views: {
                'viewT': {
                    templateUrl: '/views/teacher/wallet.html',
                    controller: 'WalletCtrl'
                }
            }
        })
        .state('teacher.income', {
            url: '/income',
            views: {
                'viewT': {
                    templateUrl: '/views/teacher/wallet.html',
                    controller: 'WalletCtrl'
                }
            }
        })
        .state('teacher.recommend', {
            url: '/recommend',
            views: {
                'viewT': {
                    templateUrl: '/views/teacher/wallet.html',
                    controller: 'WalletCtrl'
                }
            }
        })
        .state('teacher.assess', {
            url: '/assess',
            views: {
                'viewT': {
                    templateUrl: '/views/teacher/credit.html',
                    controller: 'CreditCtrl'
                }
            }
        })
        .state('teacher.point', {
            url: '/point',
            views: {
                'viewT': {
                    templateUrl: '/views/teacher/credit.html',
                    controller: 'CreditCtrl'
                }
            }
        })
        .state('teacher.star', {
            url: '/star',
            views: {
                'viewT': {
                    templateUrl: '/views/teacher/credit.html',
                    controller: 'CreditCtrl'
                }
            }
        })
        .state('teacher.calendar', {
            url: '/calendar',
            views: {
                'viewT': {
                    templateUrl: '/views/teacher/calendar.html',
                    controller: 'CalendarCtrl'
                }
            }
        })
        .state('teacher.community', {
            url: '/community',
            views: {
                'viewT': {
                    templateUrl: '/views/teacher/community.html',
                    controller: 'CommunityCtrl'
                }
            }
        })
        /* 学生 */
        .state('sh', {
            url: '/sh',
            templateUrl: '/views/student/home.html',
            controller: 'StudentCtrl'
        })
        .state('student', {
            abstract: true,
            url: '/student',
            templateUrl: '/views/student/student.html',
            controller: 'StudentCtrl'
        })
        .state('student.order', {
            url: '/order/:status',
            views: {
                'viewT': {
                    templateUrl: '/views/student/order.html',
                    controller: 'SOrderCtrl'
                }
            }
        })
        .state('student.wallet', {
            url: '/wallet',
            views: {
                'viewT': {
                    templateUrl: '/views/student/wallet.html',
                    controller: 'SWalletCtrl'
                }
            }
        })
        .state('student.class', {
            url: '/class',
            views: {
                'viewT': {
                    templateUrl: '/views/student/class.html'
                }
            }
        })
        .state('student.account', {
            url: '/account',
            views: {
                'viewT': {
                    templateUrl: '/views/student/account.html',
                    controller: 'SAccountCtrl'
                }
            }
        })
        .state('student.search', {
            url: '/search',
            views: {
                'viewT': {
                    templateUrl: '/views/student/search.html',
                    controller: 'SearchCtrl'
                }
            }
        })
        .state('student.compare', {
            url: '/compare',
            views: {
                'viewT': {
                    templateUrl: '/views/student/compare.html',
                    controller: 'SCompareCtrl'
                }
            }
        });
        // catch all route
        // send users to the form page
        $urlRouterProvider.otherwise('/index');
    }])
    // Interceptor
    .config([ '$httpProvider', function($httpProvider) {
      $httpProvider.interceptors.push('httpInterceptor');
    }])
    .run(['$rootScope', '$state', '$stateParams',
        function($rootScope, $state, $stateParams) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
    }])
    .factory('httpInterceptor', ['$q', '$injector', '$cookieStore', function($q, $injector, $cookieStore) {
        var httpInterceptor = {
            'responseError': function(response) {
                // console.log('[httpInterceptor]responseError:', response);
                return $q.reject(response.data);
            },
            'response': function(response) {
                // console.log('[httpInterceptor]response:', response);
                return response;
            },
            'request': function(config) {
                // console.log('[httpInterceptor]request.url:', config);
                var user = $cookieStore.get('user') ? $cookieStore.get('user') : undefined;
                // console.log(user);
                if(user) {
                    config.headers.Authentication = user.Authentication;
                    config.headers['User-Id'] = user.userId;
                }
                var baseUrl = "http://amali.shenqingdashi.com";
                if(config.method === "POST" || config.method === "PUT" || config.method === "DELETE") {
                    // var baseUrl = ""; config.url = config.url + '.json';
                    config.url = baseUrl + config.url;
                } else if (config.method === "GET" && config.url.indexOf('/api/') > -1) {
                    // var baseUrl = ""; config.url = config.url + '.json';
                    config.url = baseUrl + config.url;
                }
                return config;
            },
            'requestError': function(config) {
                // console.log('[httpInterceptor]requestError:', config);
                return $q.reject(config);
            }
        };
        return httpInterceptor;
    }]);
