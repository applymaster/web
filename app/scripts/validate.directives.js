'use strict';
var app = angular.module('webApp');

/* Detect Type 1: showing error message under form control */
// for input
app.directive('dnFormInput', ['formService', function(formService) {
    return {
        restrict: 'A',
        require: 'ngModel',
        replace: true,
        link: function(scope, element, attrs, ctrl) {
            var msgObj = '<span class="msg-error">123</span>',
                iconObj = '<i class="form-control-feedback glyphicon glyphicon-remove"></i>';

            // $(element).wrap(faObj).after(iconObj).parent().wrap(grandpaObj).after(msgObj);
            $(element).after(iconObj);
            $(element).parent().after(msgObj);

            scope.$watch(attrs.ngModel, function(newValue, oldValue) {
                if (ctrl.$pristine) {
                    return;
                }
                if (angular.isUndefined(attrs.ngChange)) {
                    return;
                }
                if (formService.isError) {
                    // class
                    $(element).parents('tr').removeClass('has-success').addClass('has-error');
                    // error message
                    $(element).parent().next('.msg-error').html(formService.errMsg);
                    // icon
                    $(element).next('.form-control-feedback').addClass('glyphicon-remove').removeClass('glyphicon-ok');
                } else {
                    // class
                    $(element).parents('tr').removeClass('has-error').addClass('has-success');
                    // error message
                    $(element).parent().next('.msg-error').empty();
                    // icon
                    $(element).next('.form-control-feedback').addClass('glyphicon-ok').removeClass('glyphicon-remove');
                }
            });
        }
    };
}]);