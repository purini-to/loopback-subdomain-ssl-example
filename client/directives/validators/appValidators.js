var app = angular.module('app');

app.directive('appValidators', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      appValidators: '='
    },
    link: function(scope, element, attrs, ctrl) {
      var validators = scope.appValidators || {};
      angular.forEach(validators, function(val, key) {
        ctrl.$validators[key] = val;
      });
    }
  };
});
