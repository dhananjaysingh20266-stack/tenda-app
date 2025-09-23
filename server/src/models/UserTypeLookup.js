const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/sequelize");

class UserTypeLookup extends Model {}

UserTypeLookup.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "user_typ_lkup",
    indexes: [
      {
        unique: true,
        fields: ["name"],
      },
    ],
  }
);

module.exports = UserTypeLookup;