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
require('angular-cookie');

require('./style/app.styl');

export var app = angular.module('app', [
  'ngAnimate',
  'ngResource',
  'ngMessages',
  'ngAria',
  'ngMaterial',
  'restangular',
  'ipCookie',
  'ui.router',
  'validation.match'
]);

// 設定系
import AppConstant from './components/commmon/app.constant';
import AppConfig from './components/commmon/app.config';
import AppRouter from './components/commmon/app.route';
import AppTheming from './components/commmon/app.theming';
import AppApi from './components/commmon/app.api';
import AppRun from './components/commmon/app.run';
app.constant('constant', AppConstant);
app.config(AppConfig.activate);
app.config(AppRouter.activate);
app.config(AppTheming.activate);
app.config(AppApi.activate);
app.run(AppRun.activate);

// ディレクティブ系
import FocusMe from './directives/focusMe/focusMe';
import AppValidators from './directives/validators/appValidators';
import Format from './directives/validators/format';
import Uniqueness from './directives/validators/uniqueness';
import PageAnimation from './directives/animations/pageAnimation';
import Scrollbar from './directives/scroll/scrollbar';
app.directive('focusMe', FocusMe.activate);
app.directive('appValidators', AppValidators.activate);
app.directive('format', Format.activate);
app.directive('uniqueness', Uniqueness.activate);
app.directive('pageAnimation', PageAnimation.activate);
app.directive('scrollbar', Scrollbar.activate);

// モデル系
import UserModel from './services/models/user/user';
import TeamModel from './services/models/team/team';
app.factory('userModel', UserModel.activate);
app.factory('teamModel', TeamModel.activate);

// サービス系
import ErrorHandler from './services/handler/errorHandler';
app.factory('errorHandler', ErrorHandler.activate);
