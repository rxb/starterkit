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
      allowNull: false,
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
    currentTldrVersionContent: {
      type: Sequelize.JSONB
    },
    versionsUsedCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    forkCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    voteQuantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    voteResult: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    votePositivity: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    issueCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
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
    currentUserSaved: {
      type: DataTypes.VIRTUAL,
      get: function () {
        return !!this.getDataValue('save')?.id
      }
    },
    currentUserVote: {
      type: DataTypes.VIRTUAL,
      get: function () {
        return this.getDataValue('vote')?.vote
      }
    }

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
    tldrs.belongsTo(models.categories, {
      foreignKey: 'categoryId',
      as: "category"
    });
    tldrs.hasMany(models.tldr_versions);
    tldrs.hasOne(models.tldr_versions, {
      sourceKey: "currentTldrVersionId",
      foreignKey: "id",
      as: "currentTldrVersion"
    });

    // SAVE just the existence of a save
    tldrs.hasOne(models.users_savedtldrs, {
      as: 'save',
      sourceKey: "id",
      foreignKey: 'savedTldrId'
    });

    // VOTE just the existence of a vote
    tldrs.hasOne(models.tldrs_votes, {
      as: 'vote',
      sourceKey: "id",
      foreignKey: 'tldrId'
    });

    /*
    // SAVERS actual list of the users who saved it
    tldrs.belongsToMany(models.users, {
      through: 'users_savedtldrs',
      as: 'savers',
      foreignKey: 'savedTldrId',
      otherKey: 'userId'
    });
    */

  };


  return tldrs;
};
