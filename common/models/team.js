module.exports = function(Team) {
  Team.validatesUniquenessOf('name', {message: 'name is not unique'});
};
