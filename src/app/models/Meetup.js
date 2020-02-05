import Sequelize, { Model } from 'sequelize';
import { isAfter } from 'date-fns';

class Meetup extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        date: Sequelize.DATE,
        description: Sequelize.STRING,
        localization: Sequelize.STRING,
        happened: {
          type: Sequelize.VIRTUAL,
          get() {
            return isAfter(new Date(), this.date);
          },
        },
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });
    this.belongsTo(models.File, { foreignKey: 'banner_id', as: 'banner' });
  }
}

export default Meetup;
