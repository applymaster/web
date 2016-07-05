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
    .config(function($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: '/views/home.html'
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
                        controller: 'AccountCtrl'
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

        .state('teacher.me', {
            url: '/myself',
            views: {
                'viewT': {
                    templateUrl: '/views/teacher/myself.html',
                    controller: 'TMeCtrl'
                }
            }
        })

        /*

        .state('teacher.message', {
        url: '/message',
        views: {
        'viewT': {
        templateUrl: '/views/teacher/message.html'
        }
        }
        })

        .state('teacher.help', {
        url: '/help',
        views: {
        'viewT': {
        templateUrl: '/views/teacher/help.html'
        }
        }
        })
        */

        .state('student', {
            abstract: true,
            url: '/student',
            templateUrl: '/views/student/student.html',
            controller: 'StudentCtrl'
        })

        .state('student.order', {
            url: '/order',
            views: {
                'viewT': {
                    templateUrl: '/views/student/order.html'
                }
            }
        })

        .state('student.wallet', {
            url: '/wallet',
            views: {
                'viewT': {
                    templateUrl: '/views/student/wallet.html'
                }
            }
        })

        .state('student.search', {
            url: '/search',
            templateUrl: '/views/search/search.html'
        })

        .state('search.details', {
            url: '/details',
            templateUrl: '/views/search/details.html'
        })

        .state('student.compare', {
            url: '/compare',
            views: {
                'viewT': {
                    templateUrl: '/views/student/compare.html'
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
                    templateUrl: '/views/student/account.html'
                }
            }
        })
        // catch all route
        // send users to the form page
        $urlRouterProvider.otherwise('/home');
    })
    .run(['$rootScope', '$state', '$stateParams',
        function($rootScope, $state, $stateParams) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }
    ]);
