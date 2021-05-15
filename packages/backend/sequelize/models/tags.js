'use strict';
module.exports = (sequelize, DataTypes) => {
  var tags = sequelize.define('tags', {
    label: DataTypes.TEXT
  }, {});
  tags.associate = function (models) {
    // associations can be defined here
  };
  return tags;
};