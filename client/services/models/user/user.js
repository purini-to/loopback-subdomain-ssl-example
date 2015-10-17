'use strict';

/**
 * ユーザー情報モデル
 */
export default class UserModel {
  /**
   * ユーザー情報の初期値を登録する
   */
  constructor() {
    this.user = {};
  }

  /**
   * インスタンス生成を行う
   * @param  {[type]} User ユーザー情報操作サービス
   * @return {UserModel}       ユーザー情報モデルのインスタンス
   */
  static activate(User) {
    UserModel.instance = new UserModel(User);
    return UserModel.instance;
  }
}

/**
 * DI対象の名前を登録する
 * @type {Array}
 */
UserModel.activate.$inject = ['User'];
