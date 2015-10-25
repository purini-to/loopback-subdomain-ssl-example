module.exports = function(Channel) {

  Channel.observe('after save', function(channel, next) {
    if (channel.instance) {
      var emit = 'add:channel' + channel.instance.teamId;
      Channel.emit(emit, channel.instance);
    }
    next();
  });
};
