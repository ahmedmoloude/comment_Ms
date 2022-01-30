'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Comment.hasMany(models.Reply, {
        foreignKey: 'comment_id',
        as: 'replys',
      });
    }
  };
  Comment.init({
    user_id: DataTypes.INTEGER,
    text: DataTypes.STRING,
    appraisal_id: DataTypes.INTEGER
    
  }, {
    sequelize,
    modelName: 'Comment',
    tableName : 'comments',
    createdAt : 'created_at',
    updatedAt : 'updated_at'
  });
  return Comment;
};