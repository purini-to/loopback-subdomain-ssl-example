'use strict';

/**
 * APIのルートURL
 * @type {String}
 */
const PREFIX = 'users';
/**
 * REST APIサービスキャッシュ
 */
const API = new WeakMap();

/**
 * ユーザー情報モデル
 */
export default class UserModel {
  /**
   * ユーザー情報の初期値を登録する
   * @param  {[type]} Restangular REST APIサービス
   */
  constructor(Restangular) {
    this.user = {};
    this.token = {};
    this.teams = {};
    API.set(this, Restangular);
  }

  /**
   * ログイン処理
   * @param  {Object]} account アカウント情報
   * @return {Promise]}        認証プロミス
   */
  login(account) {
    var instance = UserModel.instance;
    var rest = API.get(instance);
    var self = this;
    return rest.one(PREFIX).one('login')
      .post(null, account)
      .then((token) => {
        self.token = token;
        API.set(instance, rest.withConfig((RestangularConfigurer) => {
          RestangularConfigurer.setDefaultRequestParams({
            access_token: token.id
          });
        }));
        return token;
      });
  }

  /**
   * ユーザー情報を取得する
   * IDが引数で渡されない場合は、インスタンス情報から検索する
   * インスタンス情報から検索した場合は、取得結果をインスタンス変数に格納する
   * @param  {Integer} id ユーザーID | ユーザー情報のID | トークン情報のユーザーID
   * @return {Promise}    ユーザー情報取得プロミス
   */
  findById(id) {
    let _id = id || this.user.id || this.token.userId;
    var self = this;
    return API.get(UserModel.instance).one(PREFIX, _id).get()
      .then((user) => {
        if (!id) self.user = user;
        return user;
      });
  }

  /**
   * ユーザーが所持するチーム情報を取得する
   * IDが引数で渡されない場合は、インスタンス情報から検索する
   * インスタンス情報から検索した場合は、取得結果をインスタンス変数に格納する
   * @param  {Integer} id ユーザーID | ユーザー情報のID | トークン情報のユーザーID
   * @return {Promise}    ユーザーが所持するチーム情報取得プロミス
   */
  findTeams(id) {
    let _id = id || this.user.id || this.token.userId;
    var self = this;
    return API.get(UserModel.instance).one(PREFIX, _id).one('teams')
      .getList().then((teams) => {
        if (!id) self.teams = teams;
        return teams;
      });
  }

  /**
   * インスタンス生成を行う
   * @param  {[User]} User ユーザー情報操作サービス
   * @return {UserModel}       ユーザー情報モデルのインスタンス
   */
  static activate(Restangular) {
    UserModel.instance = new UserModel(Restangular);
    return UserModel.instance;
  }
}

/**
 * DI対象の名前を登録する
 * @type {Array}
 */
UserModel.activate.$inject = ['Restangular'];
