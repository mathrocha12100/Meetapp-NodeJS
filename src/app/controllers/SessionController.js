import * as Yup from 'yup';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().required(),
      password: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados invalidos ou incorretos' });
    }
    const { email, password } = req.body;
    const user = await User.findOne({
      where: { email },
    });
    if (!user) {
      return res.status(400).json({ error: 'Usuario não existe!' });
    }
    if (!(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }
    const { name, id } = user;
    return res.json({
      user: {
        email,
        name,
        id,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
