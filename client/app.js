'use strict';

require('angular');
require('angular-animate');
require('angular-aria');
require('angular-material');
require('angular-resource');
require('angular-ui-router');
require('angular-messages');
require('angular-validation-match');
require('restangular');

require('./style/app.styl');

export var app = angular.module('app', [
  'ngAnimate',
  'ngResource',
  'ngMessages',
  'ngAria',
  'ngMaterial',
  'lbServices',
  'restangular',
  'ui.router',
  'validation.match'
]);

// 設定系
import AppConfig from './components/commmon/app.config';
import AppRouter from './components/commmon/app.route';
import AppTheming from './components/commmon/app.theming';
app.config(AppConfig.activate);
app.config(AppRouter.activate);
app.config(AppTheming.activate);
app.config(function (RestangularProvider) {
  RestangularProvider.setBaseUrl('/api/');
});

// ディレクティブ系
import FocusMe from './directives/focusMe/focusMe';
import AppValidators from './directives/validators/appValidators';
import Format from './directives/validators/format';
import Uniqueness from './directives/validators/uniqueness';
import PageAnimation from './directives/animations/pageAnimation';
app.directive('focusMe', FocusMe.activate);
app.directive('appValidators', AppValidators.activate);
app.directive('format', Format.activate);
app.directive('uniqueness', Uniqueness.activate);
app.directive('pageAnimation', PageAnimation.activate);

// モデル系
import UserModel from './services/models/user/user';
import TeamModel from './services/models/team/team';
app.factory('userModel', UserModel.activate);
app.factory('teamModel', TeamModel.activate);

// サービス系
// Loopbackのgeneratorにより自動生成のため、クラス化されていない
// 直接読み込みを行う
require('./services/loopback/lb-services');
import ErrorHandler from './services/handler/errorHandler';
app.factory('errorHandler', ErrorHandler.activate);
