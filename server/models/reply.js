'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reply extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Reply.belongsTo(models.Comment, {
        foreignKey: 'comment_id',
        onDelete: 'CASCADE',
      });
    }
  };
  Reply.init({
    user_id: DataTypes.INTEGER,
    text: DataTypes.STRING,
    comment_id : DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Reply',
    tableName : 'replies',
    createdAt : 'created_at',
    updatedAt : 'updated_at'

  });
  return Reply;
};