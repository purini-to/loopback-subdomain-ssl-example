var app = angular.module('app');

app.factory('errorHandler', function() {
  var services = {};

  services.errorStatusHandler = function(status, validation) {
    return function(err) {
      if (err.status === status) {
        if (typeof validation === 'function') return validation(err);
        var codes = err.data.error.details.codes;
        for (var type in codes) {
          if (codes.hasOwnProperty(type)) {
            var kind = codes[type];
            validation[type][kind] = true;
          }
        }
        return err;
      } else {
        console.error(err);
        throw err;
      }
    };
  };

  return services;
});
