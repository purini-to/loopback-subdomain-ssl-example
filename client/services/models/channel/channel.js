'use strict';

// APIのルートURL
const PREFIX = 'channels';
// 各種サービスのキャッシュ
const API = new WeakMap();
const SOCKET = new WeakMap();

/**
 * メッセージを追加する関数を生成
 * @return {Function}      メッセージを追加する関数
 */
function factoryAddMessageFunc() {
  return function addMessage(data) {
    var instance = ChannelModel.instance;
    if (instance.channel && instance.channel.messages) {
      instance.channel.messages.push(data);
    }
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
    // メッセージ追加イベント時にモデルに反映させる
    teamSocket.socket.on('add:message', factoryAddMessageFunc());
    API.set(this, Restangular);
    SOCKET.set(this, teamSocket);
  }

  /**
   * メッセージを取得します
   * @param  {Object} channel チャンネル情報
   * @return {Promise}         チャンネル取得プロミス
   */
  findMessages(channel) {
    var id = channel.id || this.channel.id;
    return API.get(ChannelModel.instance).one(PREFIX, id)
      .one('messages').get().then((messages) => {
        this.channel = channel;
        this.channel.messages = messages;
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
