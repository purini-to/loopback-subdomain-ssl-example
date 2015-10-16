var app = angular.module('app');

app.directive('focusMe', function($timeout) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      scope.$watch('focusMe', function(value) {
        if (attrs.focusMe === 'true') {
          $timeout(function() {
            element[0].focus();
          });
        }
      });
    }
  };
});
