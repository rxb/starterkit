// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const showComments = sequelizeClient.define('ShowComments', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      body: {
        type: DataTypes.TEXT,
      },
      authorId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      showId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }, {
    hooks: {
      /*
      beforeCount(options) {
        options.raw = true;
      }
      */
    }
  });

  // eslint-disable-next-line no-unused-vars
  showComments.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
    showComments.belongsTo(models.users, {foreignKey: 'authorId'})
  };

  return showComments;
};
