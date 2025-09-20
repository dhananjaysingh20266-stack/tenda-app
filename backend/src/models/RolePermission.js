module.exports = (sequelize, DataTypes) => {
  const RolePermission = sequelize.define('RolePermission', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    role_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Roles',
        key: 'id',
      },
    },
    permission_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Permissions',
        key: 'id',
      },
    },
    granted_by: {
      type: DataTypes.UUID,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    granted_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    indexes: [
      {
        unique: true,
        fields: ['role_id', 'permission_id']
      }
    ]
  });

  return RolePermission;
};