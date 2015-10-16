'use strict';

require('angular');
require('angular-animate');
require('angular-aria');
require('angular-material');
require('angular-resource');
require('angular-ui-router');
require('angular-messages');
require('angular-validation-match');

require('./style/app.styl');

import AppConfig from './components/commmon/app.config';
import AppRouter from './components/commmon/app.route';
import AppTheming from './components/commmon/app.theming';

export var app = angular.module('app', [
  'ngAnimate',
  'ngResource',
  'ngMessages',
  'ngAria',
  'ngMaterial',
  'lbServices',
  'ui.router',
  'validation.match'
]);

// 設定系
app.config(AppConfig.activate);
app.config(AppRouter.activate);
app.config(AppTheming.activate);

require('./services/loopback/lb-services');
require('./services/handler/errorHandler');

require('./directives/validators/appValidators');
require('./directives/validators/uniqueness');
require('./directives/validators/format');
require('./directives/focusMe/focusMe');
