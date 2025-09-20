'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const permissions = [
      // User permissions
      { name: 'users:read', resource: 'users', action: 'read', description: 'View users' },
      { name: 'users:create', resource: 'users', action: 'create', description: 'Create new users' },
      { name: 'users:update', resource: 'users', action: 'update', description: 'Update user information' },
      { name: 'users:delete', resource: 'users', action: 'delete', description: 'Delete users' },
      
      // Gaming key permissions
      { name: 'gaming_keys:read', resource: 'gaming_keys', action: 'read', description: 'View gaming keys' },
      { name: 'gaming_keys:create', resource: 'gaming_keys', action: 'create', description: 'Generate new gaming keys' },
      { name: 'gaming_keys:update', resource: 'gaming_keys', action: 'update', description: 'Update gaming keys' },
      { name: 'gaming_keys:delete', resource: 'gaming_keys', action: 'delete', description: 'Delete/revoke gaming keys' },
      
      // Organization permissions
      { name: 'organizations:read', resource: 'organizations', action: 'read', description: 'View organization information' },
      { name: 'organizations:update', resource: 'organizations', action: 'update', description: 'Update organization settings' },
      
      // Analytics permissions
      { name: 'analytics:read', resource: 'analytics', action: 'read', description: 'View analytics and reports' },
      
      // Admin permissions
      { name: 'admin:all', resource: 'admin', action: 'all', description: 'Full administrative access' },
    ];

    const permissionRecords = permissions.map(permission => ({
      ...permission,
      id: require('uuid').v4(),
      created_at: new Date(),
      updated_at: new Date(),
    }));

    await queryInterface.bulkInsert('Permissions', permissionRecords);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Permissions', null, {});
  }
};