var loopback = require('loopback');

module.exports = function(Message) {
  // Returns null if the access token is not valid
  function getCurrentUserId() {
    var ctx = loopback.getCurrentContext();
    var accessToken = ctx.active.http.req && ctx.active.http.req.accessToken;
    var userId = accessToken && accessToken.userId;
    return userId;
  }

  /**
   * 新規作成時に作成日に現在時刻を設定する
   * @param  {MessageModel} message  メッセージのモデル
   * @param  {next} next 次の処理を行うコールバック関数
   */
  Message.observe('before save', function(message, next) {
    if (message.instance) {
      var userId = getCurrentUserId();
      message.instance.userId = userId;
      message.instance.createdAt = new Date();  
    }
    next();
  });


  /**
   * メッセージを作成した場合、通知を送信する
   * @param  {String}       通知タイプ
   * @param  {Function} コールバック
   */
  Message.observe('after save', function(message, next) {
    if (message.instance) {
      message.instance.channel(message.channelId, function(err, channel) {
        if (err) {
          console.error(err);
          throw err;
        }
        var emit = 'add:message' + channel.teamId;
        Message.emit(emit, message.instance);
      });
    }
    next();
  });
};
