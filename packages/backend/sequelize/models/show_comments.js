'use strict';
module.exports = (sequelize, DataTypes) => {
  var ShowComments = sequelize.define('ShowComments', {
    body: DataTypes.TEXT,
    authorId: DataTypes.INTEGER,
    showId: DataTypes.INTEGER
  }, {});
  ShowComments.associate = function(models) {
    // associations can be defined here
  };
  return ShowComments;
};