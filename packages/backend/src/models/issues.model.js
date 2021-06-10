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
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
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
    issues.belongsTo(models.users, { foreignKey: 'authorId', as: "author" })
    issues.belongsTo(models.tldrs, { foreignKey: 'tldrId', as: "tldr" })

  };

  return issues;
};