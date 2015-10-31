'use strict';

// APIのルートURL
const PREFIX = 'invitations';

// 各種サービスのキャッシュ
const API = new WeakMap();

/**
 * 招待情報モデル
 */
export default class InvitationModel {
  /**
   * 招待情報の初期値を登録する
   * @param  {[type]} Restangular REST APIサービス
   */
  constructor(Restangular) {
    API.set(this, Restangular);
  }

  /**
   * 招待を送信します
   * @param  {Object} data 招待情報
   * @return {Promise}     ユーザー作成プロミス
   */
  send(data) {
    return API.get(InvitationModel.instance).one(PREFIX).post(null, data);
  }

  /**
   * インスタンス生成を行う
   * @param  {[type]} Restangular REST APIサービス
   * @param  {[type]} ipCookie   クッキーサービス
   * @return {InvitationModel}   招待情報モデルのインスタンス
   */
  static activate(Restangular) {
    InvitationModel.instance = new InvitationModel(Restangular);
    return InvitationModel.instance;
  }
}

/**
 * DI対象の名前を登録する
 * @type {Array}
 */
InvitationModel.activate.$inject = [
  'Restangular',
];
