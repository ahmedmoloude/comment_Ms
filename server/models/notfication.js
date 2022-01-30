'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notfication extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Notfication.init({
    username: DataTypes.STRING,
    notifications: DataTypes.INTEGER,
    folder_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Notfication',
  });
  return Notfication;
};