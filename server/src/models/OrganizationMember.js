const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/sequelize");

class OrganizationMember extends Model {}

OrganizationMember.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    organizationId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'organizations',
        key: 'id'
      }
    },
    role: {
      type: DataTypes.ENUM('admin', 'member', 'viewer'),
      allowNull: false,
      defaultValue: 'member',
    },
    status: {
      type: DataTypes.ENUM('active', 'pending', 'inactive'),
      allowNull: false,
      defaultValue: 'pending',
    },
    permissions: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    invitedBy: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    invitedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    joinedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    lastActive: {
      type: DataTypes.DATE,
      allowNull: true,
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
    tableName: "organization_members",
    indexes: [
      {
        unique: true,
        fields: ["userId", "organizationId"],
      },
      {
        fields: ["organizationId"],
      },
      {
        fields: ["status"],
      },
      {
        fields: ["role"],
      },
    ],
  }
);

module.exports = OrganizationMember;