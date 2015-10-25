'use strict';

// APIのルートURL
const PREFIX = 'teams';
// 各種サービスのキャッシュ
const API = new WeakMap();
const SOCKET = new WeakMap();

/**
 * チームにチャンネル情報を追加する関数を生成
 * @return {Function}      チームにチャンネル情報を追加する関数
 */
function factoryAddChannelFunc() {
  return function addChannel(data) {
    var instance = TeamModel.instance;
    if (instance.team && instance.team.channels) {
      instance.team.channels.push(data);
    }
  };
}

/**
 * チーム情報モデル
 */
export default class TeamModel {
  /**
   * チーム情報の初期値を登録する
   * @param  {[type]} Team チームAPIサービス
   * @param  {[type]} teamSocket ソケットサービス
   */
  constructor(Restangular, teamSocket) {
    this.team = {};
    // チャンネル追加イベント時にモデルに反映させる
    teamSocket.socket.on('add:channel', factoryAddChannelFunc());
    API.set(this, Restangular);
    SOCKET.set(this, teamSocket);
  }

  /**
   * 条件よりチームを１件だけ取得します
   * @param  {Object} filter = {} 条件
   * @return {Promise}        TEAM取得結果
   */
  findOne(filter = {}) {
    var self = this;
    var params = {
      filter: filter
    };
    return API.get(TeamModel.instance).one(PREFIX)
      .one('findOne').get(params).then((team) => {
        var params = {
          filter: {
            include: 'channels'
          }
        };
        return API.get(TeamModel.instance).one(PREFIX, team.id).get(params);
      }).then((team) => {
        this.team = team;
        return team;
      });
  }

  /**
   * チャンネルを追加する
   * @param {Object} channel チャンネル情報
   */
  addChannel(channel) {
    return this.team.one('channels').post(null, channel);
  }

  /**
   * インスタンス生成を行う
   * @param  {[type]} Restangular REST APIサービス
   * @param  {[type]} teamSocket ソケットサービス
   * @return {TeamModel}   チーム情報モデルのインスタンス
   */
  static activate(Restangular, teamSocket) {
    TeamModel.instance = new TeamModel(Restangular, teamSocket);
    return TeamModel.instance;
  }
}

/**
 * DI対象の名前を登録する
 * @type {Array}
 */
TeamModel.activate.$inject = ['Restangular', 'teamSocket'];
