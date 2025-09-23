'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add user_typ_id column to users table
    await queryInterface.addColumn('users', 'user_typ_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'user_typ_lkup',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    // Add foreign key constraint
    await queryInterface.addConstraint('users', {
      fields: ['user_typ_id'],
      type: 'foreign key',
      name: 'users_user_typ_id_fkey',
      references: {
        table: 'user_typ_lkup',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    // Add index on user_typ_id for better query performance
    await queryInterface.addIndex('users', ['user_typ_id'], {
      name: 'users_user_typ_id_idx',
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the foreign key constraint
    await queryInterface.removeConstraint('users', 'users_user_typ_id_fkey');
    
    // Remove the index
    await queryInterface.removeIndex('users', 'users_user_typ_id_idx');
    
    // Remove the column
    await queryInterface.removeColumn('users', 'user_typ_id');
  }
};