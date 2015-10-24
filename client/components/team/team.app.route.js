'use strict';

import MainController from './channel/main.controller';
import ChannelController from './channel/channel.controller';

/**
 * アプリケーション共通のルーティング設定を行う
 */
export default class TeamAppRouter {
  /**
   * ルーティング設定を行う
   * 存在しないURLにアクセスした際は、ログイン画面へ遷移させる
   * @param  {[type]} $stateProvider     ui-routerのステート管理設定
   * @param  {[type]} $urlRouterProvider ui-routerのURL管理設定
   */
  constructor($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise(($injector) => {
      $injector.get('$state')
      .go('channel.messages', {channelName: 'general'});
    });
    $stateProvider.state('channel', {
      templateUrl: '/components/team/channel/main.html',
      controller: MainController,
      controllerAs: 'main',
      resolve: MainController.resolve(),
    }).state('channel.messages', {
      url: '/channels/:channelName',
      templateUrl: '/components/team/channel/channel.html',
      controller: ChannelController,
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
    TeamAppRouter.instance = new TeamAppRouter($stateProvider,
      $urlRouterProvider);
    return TeamAppRouter.instance;
  }
}

/**
 * DI対象の名前を登録する
 * @type {Array}
 */
TeamAppRouter.activate.$inject = ['$stateProvider', '$urlRouterProvider'];
