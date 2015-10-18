'use strict';

// APIのルートURL
const PREFIX = 'users';

// 各種サービスのキャッシュ
const API = new WeakMap();
const L_STORAGE = new WeakMap();
const S_STORAGE = new WeakMap();

/**
 * ユーザー情報モデル
 */
export default class UserModel {
  /**
   * ユーザー情報の初期値を登録する
   * @param  {[type]} Restangular REST APIサービス
   * @param  {[type]} $localStorage   ローカルストレージサービス
   * @param  {[type]} $sessionStorage セッションストレージサービス
   */
  constructor(Restangular, $localStorage, $sessionStorage) {
    this.user = {};
    this.token = {};
    this.teams = {};
    API.set(this, Restangular);
    L_STORAGE.set(this, $localStorage);
    S_STORAGE.set(this, $sessionStorage);
  }

  /**
   * ユーザーを作成します
   * @param  {Object} user ユーザー情報
   * @return {Promise}     ユーザー作成プロミス
   */
  create(user) {
    return API.get(UserModel.instance).one(PREFIX).post(null, user);
  }

  /**
   * ログイン処理
   * @param  {Object]} account アカウント情報
   * @param  {[type]} saved   [description]
   * @return {Promise]}        認証プロミス
   */
  login(account, saved = false) {
    var instance = UserModel.instance;
    var rest = API.get(instance);
    var self = this;
    return rest.one(PREFIX).one('login')
      .post(null, account)
      .then((token) => {
        self.token = token;
        self.saveStorageToken(token.id, saved);
        API.set(instance, rest.withConfig((RestangularConfigurer) => {
          RestangularConfigurer.setDefaultRequestParams({
            access_token: token.id
          });
        }));
        return token;
      });
  }

  /**
   * ストレージにアクセストークンを設定する
   * @param  {String}  token     アクセストークン
   * @param  {Boolean} saved = false セッションストレージ | ローカルストレージ
   */
  saveStorageToken(token, saved = false) {
    let instance = UserModel.instance;
    var storage = (saved) ? L_STORAGE : S_STORAGE;
    storage.get(instance).accessToken = token;
  }

  /**
   * ユーザー情報を取得する
   * IDが引数で渡されない場合は、インスタンス情報から検索する
   * インスタンス情報から検索した場合は、取得結果をインスタンス変数に格納する
   * @param  {Integer} id ユーザーID | ユーザー情報のID | トークン情報のユーザーID
   * @return {Promise}    ユーザー情報取得プロミス
   */
  findById(id) {
    let _id = id || this.token.userId || this.user.id;
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
    let _id = id || this.token.userId || this.user.id;
    var self = this;
    return API.get(UserModel.instance).one(PREFIX, _id).one('teams')
      .getList().then((teams) => {
        if (!id) self.teams = teams;
        return teams;
      });
  }

  /**
   * チームを追加する
   * @param {Object} team チーム情報
   */
  addTeam(team) {
    return this.user.post('teams', team).then((team) => {
      this.teams.push(team);
      return team;
    });
  }

  /**
   * インスタンス生成を行う
   * @param  {[User]} User ユーザー情報操作サービス
   * @param  {[type]} $localStorage   ローカルストレージサービス
   * @param  {[type]} $sessionStorage セッションストレージサービス
   * @return {UserModel}       ユーザー情報モデルのインスタンス
   */
  static activate(Restangular, $localStorage, $sessionStorage) {
    UserModel.instance = new UserModel(Restangular,
      $localStorage, $sessionStorage);
    return UserModel.instance;
  }
}

/**
 * DI対象の名前を登録する
 * @type {Array}
 */
UserModel.activate.$inject = [
  'Restangular',
  '$localStorage',
  '$sessionStorage'
];
