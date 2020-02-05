import { isAfter, format, startOfHour, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import User from '../models/User';
import Meetup from '../models/Meetup';
import File from '../models/File';
import Subscription from '../models/Subscription';
import Mail from '../../lib/Mail';

class SubscriptionController {
  async store(req, res) {
    const { meetup_id } = req.params;
    const user = await User.findByPk(req.userId, {
      attributes: ['id', 'name'],
    });
    const meetup = await Meetup.findByPk(meetup_id, {
      attributes: ['id', 'date', 'name', 'localization', 'banner_id'],
      include: [
        {
          model: User,
          as: 'provider',
        },
      ],
    });
    const image = await File.findByPk(meetup.banner_id);
    if (isAfter(new Date(), meetup.date)) {
      return res.status(400).json({ error: 'Evento já aconteceu' });
    }
    if (user.id === meetup.provider.id) {
      return res
        .status(401)
        .json({ error: 'Você não pode se inscrever no seu proprio Meetup' });
    }
    if (!meetup) {
      return res.status(400).json({ error: 'Meetup não existe' });
    }
    const userIsSubscripted = await Subscription.findOne({
      where: { user_id: req.userId, meetup_id },
    });
    if (userIsSubscripted) {
      return res.status(401).json({ error: 'Usuario já está inscrito' });
    }
    const checkDate = await Subscription.findOne({
      where: { user_id: user.id },
      include: [
        {
          model: Meetup,
          as: 'meetup',
          where: {
            date: meetup.date,
          },
        },
      ],
    });
    if (checkDate) {
      return res.status(401).json({
        error:
          'Você não pode se inscrever em Meetups que acontecem na mesma hora e no mesmo dia',
      });
    }
    const subscription = await Subscription.create({
      user_id: user.id,
      meetup_id: meetup.id,
    });
    const hourStart = startOfHour(meetup.date);
    const formatedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', ás' H:mm'hrs'",
      {
        locale: pt,
      }
    );
    await Mail.sendMail({
      to: `${meetup.provider.name} <${meetup.provider.email}>`,
      subject: 'Novo usuario inscrito!',
      template: 'subscription',
      context: {
        user: user.name,
        meetup: meetup.name,
        date: formatedDate,
        localization: meetup.localization,
        image: image.url,
      },
    });
    return res.json(subscription);
  }
}

export default new SubscriptionController();
