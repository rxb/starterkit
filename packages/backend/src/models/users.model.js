// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const serverUrl = app.get('protocol')+"://"+app.get('host');
  const sequelizeClient = app.get('sequelizeClient');
  const users = sequelizeClient.define('users', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      unique: {
        msg: 'Looks like this email address is already registered',
        fields: ['email']
      },
      validate: {
        isEmail: true,
        notEmpty: {
          msg: "Email can't be blank"
        }
      },
      
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len:{
          args: [8, 255],
          msg: "Password must be at least 8 characters long"
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Name can't be blank"
        }
      }
    },
    photoId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    photoUrl: {
      // https://sequelize-guides.netlify.com/virtual-columns/
      type: DataTypes.VIRTUAL,
      get:  function() {
        return this.getDataValue('photoId') ? `${serverUrl}/photos/${this.getDataValue('photoId')}` : null;
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
    appleId: {
      type: DataTypes.STRING,
    },
    profileComplete: {
      type: DataTypes.BOOLEAN
    },
    tempValues: {
      type: DataTypes.JSONB,
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
    isVerified: {
      type: DataTypes.BOOLEAN
    },
    verifyToken: {
      type: DataTypes.STRING
    },
    verifyShortToken: {
      type: DataTypes.STRING
    }, 
    verifyExpires: {
      type: DataTypes.DATE
    },   
    verifyChanges: {
      type: DataTypes.STRING
    },   
    resetToken: {
      type: DataTypes.STRING
    }, 
    resetShortToken: {
      type: DataTypes.STRING
    },  
    resetExpires: {
      type: DataTypes.DATE
    },  
    resetAttempts: {
      type: DataTypes.INTEGER
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


