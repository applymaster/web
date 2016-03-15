/**
 * Created by startimes on 2015/11/16.
 */
'use strict';

/* Services */

var services = angular.module('webApp.services', ['ngResource']);

services.factory('Login', ['$resource',
  function($resource) {
    return $resource(
      '/login', {}, {}
    );
  }
]);
services.factory('Register', ['$resource',
  function($resource) {
    return $resource(
      '/register', {}, {}
    );
  }
]);
