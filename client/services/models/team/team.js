'use strict';

// APIのルートURL
const PREFIX = 'teams';
// 各種サービスのキャッシュ
const API = new WeakMap();

/**
 * チーム情報モデル
 */
export default class TeamModel {
  /**
   * チーム情報の初期値を登録する
   * @param  {[type]} Team チームAPIサービス
   */
  constructor(Restangular) {
    this.team = {};
    API.set(this, Restangular);
  }

  /**
   * 条件よりチームを１件だけ取得します
   * @param  {Object} filter = {} 条件
   * @return {Promise}        TEAM取得結果
   */
  findOne(filter = {}) {
    var params = {filter: filter};
    return API.get(TeamModel.instance).one(PREFIX)
    .one('findOne').get(params).then((team) => {
      var params = {filter: {include: 'channels'}};
      return API.get(TeamModel.instance).one(PREFIX, team.id).get(params);
    }).then((team) => {
      this.team = team;
      return team;
    });
  }

  /**
   * インスタンス生成を行う
   * @param  {[type]} Restangular REST APIサービス
   * @return {TeamModel}   チーム情報モデルのインスタンス
   */
  static activate(Restangular) {
    TeamModel.instance = new TeamModel(Restangular);
    return TeamModel.instance;
  }
}

/**
 * DI対象の名前を登録する
 * @type {Array}
 */
TeamModel.activate.$inject = ['Restangular'];
