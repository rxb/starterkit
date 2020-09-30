// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const tldrs = sequelizeClient.define('tldrs', {
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    currentTldrVersionId: {
      type: DataTypes.INTEGER
    },
    authorId: {
      type: DataTypes.INTEGER
    },
    upvotes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    downvotes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    draftContent: {
      type: Sequelize.JSONB
    },
    versionsUsedCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
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
  tldrs.associate = function (models) {
    tldrs.belongsTo(models.users, {
      foreignKey: 'authorId',
      as: "author"
    });
    tldrs.hasMany(models.tldr_versions);
    tldrs.hasOne(models.tldr_versions, { 
      sourceKey: "currentTldrVersionId",
      foreignKey: "id",
      as: "currentTldrVersion"
    });
  };
  

  return tldrs;
};
