'use strict';

/**
 * @ngdoc overview
 * @name webApp
 * @description
 * # webApp
 *
 * Main module of the application.
 */
angular
  .module('webApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      /*.when('/', {
        templateUrl: '../views/main_bak.html',
        controller: 'MainBakCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })*/
      .when('/', {
        templateUrl: '../views/main.html',
        controller: 'MainCtrl'
      })
      .when('/login', {
        templateUrl: '../views/user/login.html',
        controller: 'LoginCtrl'
      })
      .when('/register/select', {
        templateUrl: '../views/user/register_select.html',
      })
      .when('/register/applicant', {
        templateUrl: '../views/user/register_applicant.html',
        controller: 'RegisterAppCtrl'
      })
      .when('/register/applicant_more', {
        templateUrl: '../views/user/register_applicant_more.html',
        controller: 'ApplicantInfoCtrl'
      })
      .when('/register/applicant_compl', {
        templateUrl: '../views/user/register_applicant_compl.html',
        controller: 'RegisterAppComplCtrl'
      })
      .when('/register/teacher', {
        templateUrl: '../views/user/register_teacher.html',
        controller: 'RegisterTeaCtrl'
      })
      .when('/register/teacher_more', {
        templateUrl: '../views/user/register_teacher_more.html',
        controller: 'TeacherInfoCtrl'
      })
      .when('/register/teacher_compl', {
        templateUrl: '../views/user/register_teacher_compl.html',
        controller: 'RegisterTeaComplCtrl'
      })
      .when('/register/active', {
        templateUrl: '../views/user/register_active.html',
        controller: 'ActiveCtrl'
      })
      .when('/register/verify_email/:key', {
        templateUrl: 'views/loading.html',
        controller: 'VerifyEmailCtrl'
      })
      .when('/order', {
        templateUrl: 'views/order_list.html',
        controller: 'OrderListCtrl'
      })
      .when('/order/:id', {
        templateUrl: 'views/order_detail.html',
        controller: 'OrderDetailCtrl'
      })
      .when('/account', {
        redirectTo: 'account/overview'
      })
      .when('/account/overview', {
        templateUrl: 'views/account/overview.html',
        controller: 'AccountOverviewCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
