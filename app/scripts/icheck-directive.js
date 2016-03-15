'use strict';

var app = angular.module('webApp');

app
    .directive('icheck', function($timeout, $parse) {
        return {
            require: 'ngModel',
            link: function($scope, element, $attrs, ngModel) {
                return $timeout(function() {
                    var value;
                    value = $attrs['value'];

                    $scope.$watch($attrs['ngModel'], function(newValue){
                        $(element).iCheck('update');
                    })

                    $scope.$watch($attrs['ngDisabled'], function(newValue){
                        $(element).iCheck('update');
                    })

                    return $(element).iCheck({
                        checkboxClass: 'icheckbox_minimal',
                        radioClass: 'iradio_minimal'

                    }).on('ifChanged', function(event) {
                        $(element).triggerHandler('change');
                        if ($(element).attr('type') === 'checkbox' && $attrs['ngModel']) {
                            $scope.$apply(function() {
                                return ngModel.$setViewValue(event.target.checked);
                            });
                        }
                        if ($(element).attr('type') === 'radio' && $attrs['ngModel']) {
                            return $scope.$apply(function() {
                                return ngModel.$setViewValue(value);
                            });
                        }
                    }).on('ifClicked', function(event) {
                        $(element).triggerHandler('click');
                        if ($(element).attr('type') === 'checkbox' && $attrs['ngModel']) {
                            $scope.$apply(function() {
                                return ngModel.$setViewValue(event.target.checked);
                            });
                        }
                        if ($(element).attr('type') === 'radio' && $attrs['ngModel']) {
                            return $scope.$apply(function() {
                                return ngModel.$setViewValue(value);
                            });
                        }
                    });
                });
            }
        }
    })
    .directive('dropkick', function($timeout, $parse) {
        return {
            require: 'ngModel',
            link: function($scope, element, $attrs, ngModel) {
                return $timeout(function() {
                    var value;
                    value = $attrs['value'];

                    $scope.$watch($attrs['ngModel'], function(newValue){
                        $(element).dropkick('refresh');
                    })

                    $scope.$watch($attrs['ngDisabled'], function(newValue){
                        $(element).dropkick('refresh');
                    })

                    $scope.$watch($attrs['disabled'], function(newValue){
                        $(element).dropkick('refresh');
                    })

                    return $(element).dropkick({
                        initialize: function(db) {
                            if ( angular.isUndefined(value) ) {
                                if ( this.item(0).innerHTML != "" )
                                    this.select(0, true);
                                else
                                    this.select(1, true);
                            }
                        },
                        mobile: true
                    });
                });
            }
        }
    });