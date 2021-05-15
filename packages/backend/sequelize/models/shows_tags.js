'use strict';
module.exports = (sequelize, DataTypes) => {
  var shows_tags = sequelize.define('shows_tags', {
    showId: DataTypes.INTEGER,
    tagId: DataTypes.INTEGER
  }, {});
  shows_tags.associate = function (models) {
    // associations can be defined here
  };
  return shows_tags;
};