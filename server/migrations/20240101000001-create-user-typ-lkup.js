'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create user_typ_lkup table
    await queryInterface.createTable('user_typ_lkup', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Add unique index on name
    await queryInterface.addIndex('user_typ_lkup', ['name'], {
      unique: true,
      name: 'user_typ_lkup_name_unique',
    });

    // Seed initial user types
    await queryInterface.bulkInsert('user_typ_lkup', [
      {
        name: 'Owner',
        description: 'Organization owner with full administrative privileges',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Member',
        description: 'Organization member with limited privileges',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_typ_lkup');
  }
};