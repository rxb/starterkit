// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const showComments = sequelizeClient.define('show_comments', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    body: {
      type: DataTypes.TEXT,
      // sequelize has a problem with notNull for now
      // so until v5 comes out, do a default value and then validate it out if you have to
      // https://github.com/sequelize/sequelize/issues/1500
      defaultValue: '',
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Please say something"
        },
        // TODO: remove; this is a joke
        notContains: {
          args: "garbage",
          msg: "Please don't make comments about garbage"
        }
      }
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    showId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
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
    showComments.belongsTo(models.users, { foreignKey: 'authorId' })
  };

  return showComments;
};
