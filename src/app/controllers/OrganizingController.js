import Meetup from '../models/Meetup';
import File from '../models/File';
import User from '../models/User';

class OrganizingController {
  async index(req, res) {
    const meetups = await Meetup.findAll({
      where: { provider_id: req.userId },
      attributes: [
        'id',
        'name',
        'date',
        'description',
        'localization',
        'happened',
      ],
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'id'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'url', 'path'],
            },
          ],
        },
        {
          model: File,
          as: 'banner',
          attributes: ['id', 'url', 'path'],
        },
      ],
    });
    if (!meetups) {
      return res
        .status(400)
        .json({ error: 'Não existem meetups nesse usuario' });
    }
    return res.json(meetups);
  }
}

export default new OrganizingController();
