'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: DataTypes.STRING,
        defaultValue: '',
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      },
      genres: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      photoId: {
        type: DataTypes.STRING,
        allowNull: true
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('events');
  }
};