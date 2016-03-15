/**
 * Created by startimes on 2015/11/16.
 */
'use strict';

var app = angular.module('webApp');

app.controller('LoginCtrl', ['$scope', 'Login', '$location', '$cookies',
  function($scope, Login, $location, $cookies) {
    $scope.loginError = '';

    $scope.login = function(email, password) {

      if (!email || email === '' || !password || password === '') {
        $scope.loginError = 'Email or password cannot be null!';
        return;
      }
      var pattern = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      if (!pattern.test(email)) {
        $scope.loginError = 'Wrong Email format!';
        return;
      }

      Login.save(
        {email:email, password:md5(password, email)},
        function(response) {
          if (response.success) {
            $cookies.putObject('user', response.user);
            $scope.setUser(response.user);
            $location.path('/home');
          } else {
            $scope.loginError = response.msg;
          }
        },
        function(response) {
          $scope.loginError = response.data;
        }
      );
    };
  }
]);

app.controller('RegisterAppCtrl', ['$scope', '$http', 'Register', 'Login', '$location',
  function($scope, $http, Register, Login, $location) {
    $scope.loginError = '';

    $scope.register = function(email, password, passwordConfirm) {
      if (!$scope.assignment)
      {
        $scope.loginError = 'You need to agree with our policy fo continue!';
        return;
      }

      if (!email || email === '' || !password || password === '' || !passwordConfirm || passwordConfirm === '') {
        $scope.loginError = 'Email or password cannot be null!';
        return;
      }
      if (password !== passwordConfirm) {
        $scope.loginError = 'Two passwords are not the same!';
        return;
      }
      var pattern = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      if (!pattern.test(email)) {
        $scope.loginError = 'Wrong Email format!';
        return;
      }

      Register.save(
        {email:email, password:md5(password, email), type:0},
        function(response) {
          if (response.success) {
            Login.save(
              {email:email, password:md5(password, email)},
              function(response) {
                if (response.success) {
                  //$location.path('/home');
                  $location.path('/register/applicant_more');
                } else {
                  $scope.loginError = response.msg;
                }
              },
              function(response) {
                $scope.loginError = response.data;
              }
            );
          } else {
            $scope.loginError = response.msg;
          }
        },
        function(response) {
          $scope.loginError = response.data;
        }
      );
    };
  }
]);

app.controller('ApplicantInfoCtrl', ['$scope', '$http',
  function($scope, $http) {
    $scope.educations = [{name:"",id:0}];
    $scope.addEducation = function() {
      $scope.educations.push({name:'',id:0});
    };

    $('#datepicker').datepicker({
      format: 'yyyy-mm-dd',
      language: 'zh-CN'
    });

    $scope.submit = function() {
      // save user info

      // jump to active page
      $scope.navTo('register/active');
    };
  }
]);

app.controller('RegisterAppComplCtrl', ['$scope', '$http',
  function($scope, $http) {
  }
]);

app.controller('RegisterTeaCtrl', ['$scope', '$http', 'Register', 'Login', '$location',
  function($scope, $http, Register, Login, $location) {
    $scope.setBreadcrumb([
      { href: "#/home", name: "申请大师" },
      { href: "#/register/teacher", name: "注册留学顾问" }
    ]);
    $scope.loginError = '';

    $scope.register = function(email, password, passwordConfirm) {
      if (!$scope.assignment)
      {
        $scope.loginError = 'You need to agree with our policy fo continue!';
        return;
      }

      if (!email || email === '' || !password || password === '' || !passwordConfirm || passwordConfirm === '') {
        $scope.loginError = 'Email or password cannot be null!';
        return;
      }
      if (password != passwordConfirm) {
        $scope.loginError = 'Two passwords are not the same!';
        return;
      }
      var pattern = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      if (!pattern.test(email)) {
        $scope.loginError = 'Wrong Email format!';
        return;
      }

      Register.save(
        {email:email, password:md5(password, email), type:1},
        function(response) {
          if (response.success) {
            Login.save(
              {email:email, password:md5(password, email)},
              function(response) {
                if (response.success) {
                  //$location.path('/home');
                  $location.path('/register/teacher_more');
                } else {
                  $scope.loginError = response.msg;
                }
              },
              function(response) {
                $scope.loginError = response.data;
              }
            );
          } else {
            $scope.loginError = response.msg;
          }
        },
        function(response) {
          $scope.loginError = response.data;
        }
      );
    };
  }
]);

app.controller('TeacherInfoCtrl', ['$scope', '$http',
  function($scope, $http) {
    $scope.setBreadcrumb([
      { href: "#/home", name: "申请大师" },
      { href: "javascript:void()", name: "顾问详细信息" }
    ]);
    $scope.educations = [{name:"",id:0}];
    $scope.addEducation = function() {
      $scope.educations.push({name:"",id:0});
    };

    $('#datepicker').datepicker({
      format: 'yyyy-mm-dd',
      language: 'zh-CN'
    });

    $scope.submit = function() {
      // save user info

      // jump to active page
      $scope.navTo('register/active');
    }
  }
]);

app.controller('RegisterTeaComplCtrl', ['$scope', '$http',
  function($scope, $http) {
  }
]);

app.controller('ActiveCtrl', ['$scope', '$http',
  function($scope, $http) {
    // send verify email
    $http.get('/verifyEmail').
      success(function(data) {
        console.log('email sent.' + JSON.stringify(data));
      }).
      error(function(data, status, headers, config) {
        console.log('send email failed.' + JSON.stringify(data));
      });

    $scope.jumpToMailServer = function() {

    }
  }
]);

app.controller('VerifyEmailCtrl', ['$scope', '$http', '$routeParams',
  function($scope, $http, $routeParams) {
    var key = $routeParams.key;
    $http.get('/verifyEmailCallback/' + key).
      success(function() {
        $scope.navTo('register/applicant_compl');
      }).
      error(function(data) {
        $scope.noti = "验证失败，请重新验证";
      });
  }
]);
