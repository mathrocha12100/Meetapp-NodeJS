module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('meetups', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      localization: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      banner_id: {
        type: Sequelize.INTEGER,
        references: { model: 'files', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        allowNull: true,
      },
      provider_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('meetups');
  },
};
