'use strict';

/**
 * チームソケットクラス
 */
export default class TeamSocket {
  /**
   * コネクションハンドシェイクを行う
   * @param  {[type]} $location     ロケーションサービス
   * @param  {AppConstant} constant アプリケーション定数
   * @param  {[type]} socketFactory ソケットファクトリサービス
   */
  constructor($location, constant, socketFactory) {
    this.socket = null;
    /**
     * ソケット接続を行う
     * @param  {String} name    チーム名
     * @param  {Function} errorCb エラー時のコールバック関数
     */
    this.connect = (name, errorCb) => {
      var teamName = $location.host().replace(`.${constant.domain}`, '');
      var socket = io(`:${$location.port()}/${teamName}`);
      this.socket = socketFactory({
        ioSocket: socket
      });
      this.socket.on('error', function(error) {
        console.error(error);
        errorCb(error);
      });
    };
  }

  /**
   * インスタンス生成を行う
   * @param  {[type]} $location     ロケーションサービス
   * @param  {AppConstant} constant アプリケーション定数
   * @param  {[type]} socketFactory ソケットファクトリサービス
   * @return {TeamSocket}        チームソケットのインスタンス
   */
  static activate($location, constant, socketFactory) {
    TeamSocket.instance = new TeamSocket($location, constant, socketFactory);
    return TeamSocket.instance;
  }
}

/**
 * DI対象の名前を登録する
 * @type {Array}
 */
TeamSocket.activate.$inject = [
  '$location',
  'constant',
  'socketFactory',
];
