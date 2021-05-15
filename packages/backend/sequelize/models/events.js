'use strict';
module.exports = (sequelize, DataTypes) => {
  var events = sequelize.define('events', {
    title: DataTypes.TEXT
  }, {});
  events.associate = function (models) {
    // associations can be defined here
  };
  return events;
};