module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('subscriptions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        reference: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        allowNull: false,
      },
      meetup_id: {
        type: Sequelize.INTEGER,
        reference: { model: 'meetups', key: 'id' },
        onDelete: 'CASCADE',
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
    return queryInterface.dropTable('subscriptions');
  },
};
