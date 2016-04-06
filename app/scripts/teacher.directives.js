'use strict';
var app = angular.module('teacherModule');

app.directive('mzTeacherHover', function() {
    return {
        restrict: 'A',
        replace: true,
        link: function(scope, element, attrs) {
            $(element).hover(function() {
                /* Stuff to do when the mouse enters the element */
                var imgSrc = '../images/home/' + attrs.id + '.hover.png';
                $(element[0]).find('img').attr('src', imgSrc);
            }, function() {
                /* Stuff to do when the mouse leaves the element */
                var imgSrc = '../images/home/' + attrs.id + '.png';
                $(element[0]).find('img').attr('src', imgSrc);
            });
        }
    };
});