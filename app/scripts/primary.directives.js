'use strict';
var app = angular.module('primaryModule');

// 表单检测
app.directive('mzDetectInput', [function() {
    return {
        link: function(scope, element, attrs, ctrl) {
            var faObj = '<span></span>',
                msgObj = '<div class="error-message"><span class="text-danger"></span></div>';
            $(element).wrap(faObj).after(msgObj);
        }
    };
}]);
app.directive('mzDetectInput2', [function() {
    return {
        link: function(scope, element, attrs, ctrl) {
            var msgObj = '<div class="error-message"><span class="text-danger"></span></div>';
            $(element).parents('.input-group').after(msgObj);
        }
    };
}]);
app.directive("mzName", [function() {
    return {
        require: "ngModel",
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$name = attrs.mzName;
            var formController = elm.controller('form') || { $addControl: angular.noop };
            formController.$addControl(ctrl);
            scope.$on('$destroy', function() {
                formController.$removeControl(ctrl);
            });
        }
    };
}]);
// 提示信息
app.directive('tooltip', [function($translate) {
    return {
        link: function(scope, element, attrs) {
            $(element).tooltip({
                placement: attrs['toolPlacement'] || "top",
                html: true,
                title: attrs['toolTitleFunc'] ? scope[attrs.toolTitleFunc]() : attrs.title
            });
        }
    }
}]);

// 日历
app.directive('calendarTitle', ['calService', function(calService) {
    return {
        restrict: 'AE',
        template: '\
            <div class="title row">\
                <div class="month col-xs-1 col-sm-1 col-md-1 col-lg-1">{{title.month}}</div>\
                <div class="word col-xs-6 col-sm-6 col-md-6 col-lg-6">\
                    <div>{{title.year}}</div>\
                    <div>农历 {{title.lyear}} {{title.zyear}} 年</div>\
                    <div>{{title.eng}}</div>\
                </div>\
            </div>',
        scope: true,
        link: function(scope, element, attrs) {
            scope.title = calService.showTitle();
            scope.cal = {
                date: 1,
                lunar: '廿六'
            }
        }
    }
}]);
app.directive('calendarTable', ['calService', 'ngDialog', function(calService, ngDialog) {
    return {
        restrict: 'E',
        template: '<table class="content"></table>',
        replace: true,
        scope: true,
        link: function(scope, element, attrs) {
            element.html(calService.showMonth());
            element.find('td').bind('click', function(evn) {
                ngDialog.open({
                    template: 'addCalender',
                    controller: 'CalendarCtrl',
                    showClose: false,
                    data: {
                        id: evn.currentTarget.id
                    }
                });
            });
        }
    }
}]);

// 点击button时, 恢复原始数据
app.directive('btnCancel', [function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs, ctrl) {
            $(element).bind('click', function() {
                if (attrs.data) {
                    scope.$apply(function() {
                        var i, item,
                            strReset = attrs.data.replace(/, /g, ','),
                            arrReset = strReset.indexOf(',') > -1 ? strReset.split(',') : [strReset];
                        for (i = 0; i < arrReset.length; i++) {
                            item = arrReset[i];
                            if (arrReset.length == 1) {
                                scope[item] = angular.copy(scope.origData);
                            } else {
                                scope[item] = angular.copy(scope.origData[i]);
                            }
                        }
                    })
                }
            })
        }
    }
}]);
/**
 * The ng-thumb directive
 * @author: nerv
 * @version: 0.1.2, 2014-01-09
 */
app.directive('ngThumb', ['$window', function($window) {
    var helper = {
        support: !!($window.FileReader && $window.CanvasRenderingContext2D),
        isFile: function(item) {
            return angular.isObject(item) && item instanceof $window.File;
        },
        isImage: function(file) {
            var type = '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    };

    return {
        restrict: 'A',
        template: '<canvas/>',
        link: function(scope, element, attributes) {
            if (!helper.support) return;

            var params = scope.$eval(attributes.ngThumb);

            if (!helper.isFile(params.file)) return;
            if (!helper.isImage(params.file)) return;

            var canvas = element.find('canvas');
            var reader = new FileReader();

            reader.onload = onLoadFile;
            reader.readAsDataURL(params.file);

            function onLoadFile(event) {
                var img = new Image();
                img.onload = onLoadImage;
                img.src = event.target.result;
            }

            function onLoadImage() {
                var width = params.width || this.width / this.height * params.height;
                var height = params.height || this.height / this.width * params.width;
                canvas.attr({ width: width, height: height });
                canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
            }
        }
    };
}]);
