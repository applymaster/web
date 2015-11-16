/**
 * Created by startimes on 2015/11/16.
 */
angular.module('webApp')
  .controller('BaseCtrl', ['$scope', '$location', '$element', '$cookies',
    function($scope, $location, $element, $cookies) {
      // do something when initializing
      $scope.resourcePath = resourcePath;

      $scope.navTo = function(path) {
        $location.path(path);
      };

      $scope.back = function() {
        history.back();
      };

      $scope.setUser = function(user) {
        $scope.user = user;
      };
      $scope.setUser($cookies.getObject("user"));

      $scope.isConsultant = function() {
        return $scope.user != undefined &&
          $scope.user.type == 1;
      };

      $scope.setBreadcrumb = function(bc) {
        $scope.breadcrumb = bc;
      };

      $scope.$on('$routeChangeSuccess', function() {
        $scope.setBreadcrumb([]);
      });
    }
  ]);
