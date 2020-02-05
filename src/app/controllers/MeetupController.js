import * as Yup from 'yup';
import { isAfter, parseISO, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
import Meetup from '../models/Meetup';
import User from '../models/User';

class MeetupController {
  async index(req, res) {
    const { date, page = 1 } = req.query;
    const parsedDate = parseISO(date);
    const meetups = await Meetup.findAll({
      where: {
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      order: ['date'],
      limit: 10,
      offset: (page - 1) * 10,
    });
    return res.json(meetups);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      localization: Yup.string(),
      date: Yup.date(),
      description: Yup.string(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados incorretos' });
    }
    const { id } = req.params;
    const meetup = await Meetup.findByPk(id);
    if (!meetup) {
      return res.status(400).json({ error: 'Meetup não existe' });
    }
    if (req.userId !== meetup.provider_id) {
      return res.status(401).json({
        error: 'Apenas o criador desse evento pode alterar os dados dele',
      });
    }

    if (isAfter(new Date(), meetup.date)) {
      return res.status(400).json({ error: 'Evento já aconteceu' });
    }
    const { date, localization, name, description, banner_id } = req.body;
    if (isAfter(new Date(), parseISO(date))) {
      return res.status(400).json({ error: 'Data invalida' });
    }
    await meetup.update({
      name,
      localization,
      description,
      date,
      banner_id,
    });
    return res.json({
      name,
      localization,
      description,
      date,
      banner_id,
    });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      date: Yup.date().required(),
      description: Yup.string(),
      localization: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados invalidos' });
    }
    const { name, date, description, localization } = req.body;
    /**
     * Checar se a data é passada.
     */
    if (isAfter(new Date(), parseISO(date))) {
      return res.status(400).json({ error: 'Data invalida' });
    }
    /**
     * Checa se o usuario já marcou um evento nessa data
     */
    const checkDate = await Meetup.findOne({
      where: { date },
      include: [
        {
          model: User,
          as: 'provider',
          where: { id: req.userId },
        },
      ],
    });
    if (checkDate) {
      return res.status(401).json({
        error: 'Você não pode marcar um evento nessa data',
      });
    }
    const meetup = await Meetup.create({
      name,
      date,
      description,
      localization,
      provider_id: req.userId,
    });

    return res.json(meetup);
  }

  async delete(req, res) {
    const { id } = req.params;
    const meetup = await Meetup.findByPk(id);
    if (!meetup) {
      return res.status(400).json({ error: 'Evento não existe' });
    }
    if (isAfter(new Date(), meetup.date)) {
      return res.status(401).json({
        error: 'Não é possivel cancelar esse evento',
      });
    }
    if (req.userId !== meetup.provider_id) {
      return res
        .status(401)
        .json({ error: 'Apenas o dono pode cancelar esse evento' });
    }
    await meetup.destroy();
    return res.json({ message: 'O evento foi deletado com sucesso!' });
  }
}

export default new MeetupController();
