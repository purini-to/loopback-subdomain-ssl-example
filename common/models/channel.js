module.exports = function(Channel) {

  /**
   * チャンネル作成時に通知を送信する
   * @param  {String}       通知タイプ
   * @param  {Function} コールバック
   */
  Channel.observe('after save', function(channel, next) {
    if (channel.instance) {
      var emit = 'add:channel' + channel.instance.teamId;
      Channel.emit(emit, channel.instance);
    }
    next();
  });
};
