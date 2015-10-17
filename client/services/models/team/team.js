'use strict';

const TEAM = new WeakMap();

/**
 * チーム情報モデル
 */
export default class TeamModel {
  /**
   * チーム情報の初期値を登録する
   * @param  {[type]} Team チームAPIサービス
   */
  constructor(Team) {
    this.team = {};
    TEAM.set(this, Team);
  }

  /**
   * インスタンス生成を行う
   * @param  {[type]} Team チーム情報操作サービス
   * @return {TeamModel}   チーム情報モデルのインスタンス
   */
  static activate(Team) {
    TeamModel.instance = new TeamModel(Team);
    return TeamModel.instance;
  }
}

/**
 * DI対象の名前を登録する
 * @type {Array}
 */
TeamModel.activate.$inject = ['Team'];
