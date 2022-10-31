// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const categories = sequelizeClient.define('categories', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    urlKey: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: {
        msg: 'Sorry, this one is taken. Try something different?',
        fields: ['urlKey']
      },
      validate: {
        is: /^[a-zA-Z0-9_-]*$/
      }
    },
    tldrCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    name: {
      type: DataTypes.TEXT
    },
    color: {
      type: DataTypes.TEXT
    },
    description: {
      type: DataTypes.TEXT
    },
    keywords: {
      type: DataTypes.TEXT
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  categories.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
    categories.hasMany(models.tldrs);
  };

  return categories;
};
