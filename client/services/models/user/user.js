'use strict';

// APIのルートURL
const PREFIX = 'users';
const PREFIX_TOKEN = 'accessTokens';
// クッキーに保存するキー
const COOKIE_KEY_ACCESS_INFO = 'access_info';

// 各種サービスのキャッシュ
const API = new WeakMap();
const COOKIE = new WeakMap();

/**
 * ユーザー情報モデル
 */
export default class UserModel {
  /**
   * ユーザー情報の初期値を登録する
   * @param  {[User]} Restangular REST APIサービス
   * @param  {[type]} ipCookie   クッキーサービス
   */
  constructor(Restangular, ipCookie) {
    this.user = {};
    this.token = {};
    this.teams = {};
    API.set(this, Restangular);
    COOKIE.set(this, ipCookie);
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
   * アクセストークンをAPIのデフォルトパラメータとして設定する
   * @param {String} token アクセストークン
   */
  setDefaultRequestParamsByToken(token) {
    let _token = token || this.token.id;
    var instance = UserModel.instance;
    var rest = API.get(instance);
    API.set(instance, rest.withConfig((RestangularConfigurer) => {
      RestangularConfigurer.setDefaultRequestParams({
        access_token: _token
      });
    }));
  }

  /**
   * ログイン状態か判定します
   * @return {Boolean} true:ログイン状態 | false:未ログイン状態
   */
  isLogged() {
    return this.token.id && this.user.id;
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
        self.setDefaultRequestParamsByToken(token.id);
        return token;
      });
  }

  /**
   * ストレージにアクセストークンを設定する
   * @param  {String}  token     アクセストークン
   * @param  {Boolean} saved = false セッションストレージ | ローカルストレージ
   */
  saveStorageToken(saved = false) {
    return () => {
      var instance = UserModel.instance;
      var options = {
        secure: true,
        domain: '.loopback.example.com',
        path: '/',
      };
      var cookie = COOKIE.get(instance);
      cookie.remove(COOKIE_KEY_ACCESS_INFO);
      if (saved) {
        options.expires = instance.token.ttl;
      }
      cookie(COOKIE_KEY_ACCESS_INFO, {
        token: instance.token.id
      }, options);
      return instance;
    };
  }

  /**
   * ストレージに保存したアクセストークンを取得します
   * @return {String} アクセストークン
   */
  getStorageToken() {
    return COOKIE.get(UserModel.instance)(COOKIE_KEY_ACCESS_INFO);
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
   * アクセストークンからユーザー情報を取得します
   * @param  {[type]} token [description]
   * @return {[type]}       [description]
   */
  findAccessToken(token) {
    let _token = token || this.token.id;
    var self = this;
    return API.get(UserModel.instance).one(PREFIX_TOKEN, _token).get()
      .then((accessToken) => {
        self.token = accessToken;
        self.setDefaultRequestParamsByToken(accessToken.id);
        return accessToken;
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
    return this.user.post('teams', team);
  }

  /**
   * インスタンス生成を行う
   * @param  {[User]} Restangular REST APIサービス
   * @param  {[type]} ipCookie   クッキーサービス
   * @return {UserModel}       ユーザー情報モデルのインスタンス
   */
  static activate(Restangular, ipCookie) {
    UserModel.instance = new UserModel(Restangular, ipCookie);
    return UserModel.instance;
  }
}

/**
 * DI対象の名前を登録する
 * @type {Array}
 */
UserModel.activate.$inject = [
  'Restangular',
  'ipCookie',
];
