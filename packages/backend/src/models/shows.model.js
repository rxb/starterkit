// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const shows = sequelizeClient.define('shows', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    photoId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    photoUrl: {
      // needs to be defined even if we set in hooks
      type: DataTypes.VIRTUAL
    }
  },
  {
    hooks: {
      /*
      beforeCount(options) {
        options.raw = true;
      }
      */
    }
  });

  // eslint-disable-next-line no-unused-vars
  shows.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
    shows.hasMany(models.ShowComments);
  };

  return shows;
};
