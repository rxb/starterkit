// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const issues = sequelizeClient.define('issues', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    title: {
      type: DataTypes.TEXT
    },
    body: {
      type: DataTypes.TEXT
    },
    status: {
      type: DataTypes.INTEGER
    },
    authorId: {
      type: DataTypes.INTEGER
    },
    tldrId: {
      type: DataTypes.INTEGER
    }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  issues.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
    issues.hasMany(models.issue_comments);
    issueComments.belongsTo(models.users, { foreignKey: 'authorId' })
    issueComments.belongsTo(models.tldrs, { foreignKey: 'tldrId' })

  };

  return issues;
};
