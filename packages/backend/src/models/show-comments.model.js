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
      allowNull: false
    },
    body: DataTypes.TEXT,
    authorId: DataTypes.INTEGER,
    showId: DataTypes.INTEGER
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
    showComments.belongsTo(models.shows, {foreignKey: 'showId'})
  };

  return showComments;
};
