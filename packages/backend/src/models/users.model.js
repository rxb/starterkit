// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const users = sequelizeClient.define('users', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      //allowNull: false,
      //unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      //allowNull: false
    },
    name: {
      type: DataTypes.STRING,
    },
    photoId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    photoUrl: {
      // https://sequelize-guides.netlify.com/virtual-columns/
      type: DataTypes.VIRTUAL,
      get:  function() {
        return `http://localhost:3030/photos/${this.getDataValue('photoId')}`
      }
    },
    facebookId: {
      type: DataTypes.BIGINT,
    },
    googleId: {
      type: DataTypes.STRING,
    },
    redditId: {
      type: DataTypes.STRING,
    },
    urlKey: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
      validate: {
        is: /^[a-zA-Z0-9_-]*$/
      }
    },    
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  users.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return users;
};


