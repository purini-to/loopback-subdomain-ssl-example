'use strict';

import LoginCtrl from '../login/login.controller';
import NewAccountCtrl from '../newAccount/newAccount.controller';
import DashboardCtrl from '../dashboard/dashboard.controller';
import AddTeamController from '../addTeam/addTeam.controller';

/**
 * アプリケーション共通のルーティング設定を行う
 */
export default class AppRouter {
  /**
   * ルーティング設定を行う
   * 存在しないURLにアクセスした際は、ログイン画面へ遷移させる
   * @param  {[type]} $stateProvider     ui-routerのステート管理設定
   * @param  {[type]} $urlRouterProvider ui-routerのURL管理設定
   */
  constructor($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/user/login');
    $stateProvider.state('login', {
      url: '/user/login',
      templateUrl: '/components/login/login.html',
      controller: LoginCtrl,
      controllerAs: 'vm',
    }).state('newAccount', {
      url: '/user/account/new',
      templateUrl: '/components/newAccount/newAccount.html',
      controller: NewAccountCtrl,
      controllerAs: 'vm',
    }).state('dashboard', {
      url: '/team/dashboard',
      templateUrl: '/components/dashboard/dashboard.html',
      controller: DashboardCtrl,
      controllerAs: 'vm',
      resolve: {
        teams: function($state, userModel) {
          return userModel.findTeams()
            .then((result) => {
              if (!userModel.teams || userModel.teams.length === 0)
                $state.go('addTeam');
              return result;
            });
        }
      },
      auth: true,
    }).state('addTeam', {
      url: '/team/addTeam',
      templateUrl: '/components/addTeam/addTeam.html',
      controller: AddTeamController,
      controllerAs: 'vm',
      auth: true,
    });
  }

  /**
   * インスタンス生成を行う
   * @param  {[type]} $stateProvider     ui-routerのURL管理設定
   * @param  {[type]} $urlRouterProvider ui-routerのURL管理設定
   * @return {AppRouter}                   ルーティング設定クラスのインスタンス
   */
  static activate($stateProvider, $urlRouterProvider) {
    AppRouter.instance = new AppRouter($stateProvider, $urlRouterProvider);
    return AppRouter.instance;
  }
}

/**
 * DI対象の名前を登録する
 * @type {Array}
 */
AppRouter.activate.$inject = ['$stateProvider', '$urlRouterProvider'];
