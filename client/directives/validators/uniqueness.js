var app = angular.module('app');

app.directive('uniqueness', function() {
  return {
    require: 'ngModel',
    link: function(scope, elem, attrs, modelCtrl) {
      var uniquenessValue = null;
      modelCtrl.$parsers.push(function(viewValue) {
        if (!attrs.uniqueness) return viewValue;

        var val = scope.$eval(attrs.uniqueness);
        if (!val) return viewValue;

        if (uniquenessValue !== viewValue) {
          modelCtrl.$setValidity('uniqueness', true);
          var objKeys = attrs.uniqueness.split('.');
          var i = 0;
          objKeys.reduce(function (p, c) {
            if (i === objKeys.length - 1) {
              p[c] = false;
            }
            i++;
            return p[c];
          }, scope);
          return viewValue;
        }
      });
      scope.$watch(attrs.uniqueness, function(newValue) {
        modelCtrl.$setValidity('uniqueness', !newValue);
        if (newValue) {
          uniquenessValue = modelCtrl.$modelValue;
        }
      });
    }
  };
});
