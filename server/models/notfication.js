const { Model } = require('sequelize');

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
  }
  Notfication.init(
    {
      user_id: DataTypes.INTEGER,
      notif_count: DataTypes.INTEGER,
      appraisal_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Notfication',
      tableName: 'notifications',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  );
  return Notfication;
};
