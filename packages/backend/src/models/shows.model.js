// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;


module.exports = function (app) {
  const serverUrl = app.get('protocol') + "://" + app.get('host');
  const sequelizeClient = app.get('sequelizeClient');
  const shows = sequelizeClient.define('shows', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    title: {
      type: DataTypes.TEXT,
      defaultValue: '',
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Please say something"
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    genres: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    photoId: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    photoUrl: {
      // https://sequelize-guides.netlify.com/virtual-columns/
      type: DataTypes.VIRTUAL,
      get() {
        return this.getDataValue('photoId') ? `${serverUrl}/photos/${this.getDataValue('photoId')}` : null;
      }
    },
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
    shows.hasMany(models.show_comments);
    shows.belongsToMany(models.tags, {
      through: 'shows_tags',
      as: 'tags',
      foreignKey: 'showId'
    });
  };

  return shows;
};
