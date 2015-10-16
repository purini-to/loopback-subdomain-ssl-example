var app = angular.module('app');

app.directive('format', function() {
  return {
    require: 'ngModel',
    link: function(scope, elem, attrs, modelCtrl) {
      var formatValue = null;
      modelCtrl.$parsers.push(function(viewValue) {
        if (!attrs.format) return viewValue;

        var val = scope.$eval(attrs.format);
        if (!val) return viewValue;

        if (formatValue !== viewValue) {
          modelCtrl.$setValidity('format', true);
          var objKeys = attrs.format.split('.');
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
      scope.$watch(attrs.format, function(newValue) {
        modelCtrl.$setValidity('format', !newValue);
        if (newValue) {
          formatValue = modelCtrl.$modelValue;
        }
      });
    }
  };
});
