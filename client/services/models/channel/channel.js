'use strict';

// APIのルートURL
const PREFIX = 'channels';
// 各種サービスのキャッシュ
const API = new WeakMap();
const SOCKET = new WeakMap();

// デフォルトで検索時に指定するフィルタパラメータ
const DEFAULT_LIMIT = 30;
const DEFAULT_ORDER = 'id desc';

/**
 * メッセージを追加する関数を生成
 * @return {Function}      メッセージを追加する関数
 */
function factoryAddMessageFunc() {
  return function addMessage(data) {
    var instance = ChannelModel.instance;
    if (instance.channel && instance.channel.messages) {
      instance.channel.messages.push(data);
      instance.addMessageHook.forEach(function(cb) {
        cb(data);
      });
    }
  };
}

/**
 * フィルタのパラメータ（文字列）を取得します
 * @param  {Integer} skip 読み込みメッセージのスキップ数（オフセット）
 * @return {String}       フィルタ文字列
 */
function getFilterParam(skip) {
  var params = {
    limit: DEFAULT_LIMIT,
    order: DEFAULT_ORDER
  };
  if (skip) params.skip = skip;
  return {
    filter: JSON.stringify(params)
  };
}

/**
 * チャンネル情報モデル
 */
export default class ChannelModel {
  /**
   * チャンネル情報の初期値を登録する
   * @param  {[type]} Restangular REST APIサービス
   * @param  {[type]} teamSocket ソケットサービス
   */
  constructor(Restangular, teamSocket) {
    this.channel = {};
    this.addMessageHook = [];
    this.isLimitMore = false;
    // メッセージ追加イベント時にモデルに反映させる
    teamSocket.socket.on('add:message', factoryAddMessageFunc());
    API.set(this, Restangular);
    SOCKET.set(this, teamSocket);
  }

  /**
   * インスタンス変数を初期化します
   */
  clear() {
    this.channel = {};
    this.addMessageHook = [];
    this.isLimitMore = false;
  }

  /**
   * メッセージを取得します
   * @param  {Object} channel チャンネル情報
   * @return {Promise}         チャンネル取得プロミス
   */
  findMessages(channel) {
    var id = channel.id || this.channel.id;
    return API.get(ChannelModel.instance).one(PREFIX, id)
      .one('messages').get(getFilterParam()).then((messages) => {
        this.channel = channel;
        this.channel.messages = messages.reverse();
        return messages;
      });
  }

  /**
   * 追加でメッセージを取得します
   * @return {Promise} メッセージ取得プロミス
   */
  findMoreMessages() {
    if (this.isLimitMore) return;
    var id = this.channel.id;
    var skip = this.channel.messages.length;
    return API.get(ChannelModel.instance).one(PREFIX, id)
      .one('messages').get(getFilterParam(skip)).then((messages) => {
        if (messages.length === 0) {
          this.isLimitMore = true;
          return messages;
        }
        var _m = messages.reverse();
        this.channel.messages = _m.concat(this.channel.messages);
        return messages;
      });
  }

  /**
   * メッセージを送信します
   * @param  {Object} message メッセージオブジェクト
   * @return {Promise}        メッセージ送信結果プロミス
   */
  sendMessage(message) {
    if (!this.channel.id) throw new Error('チャンネルが存在しません');
    return API.get(ChannelModel.instance).one(PREFIX, this.channel.id)
      .one('messages').post(null, message);
  }

  /**
   * メッセージ追加時に起動する処理を登録する
   * @param  {Function} cb コールバック
   */
  hookAddMessage(cb) {
    this.addMessageHook.push(cb);
  }

  /**
   * インスタンス生成を行う
   * @param  {[type]} Restangular REST APIサービス
   * @param  {[type]} teamSocket ソケットサービス
   * @return {ChannelModel}   チャンネル情報モデルのインスタンス
   */
  static activate(Restangular, teamSocket) {
    ChannelModel.instance = new ChannelModel(Restangular, teamSocket);
    return ChannelModel.instance;
  }
}

/**
 * DI対象の名前を登録する
 * @type {Array}
 */
ChannelModel.activate.$inject = ['Restangular', 'teamSocket'];
