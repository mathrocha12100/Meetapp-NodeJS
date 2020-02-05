import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async index(req, res) {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(400).json({ error: 'Usuario não existe' });
    }
    return res.json(user);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      password: Yup.string()
        .required()
        .min(6),
      email: Yup.string()
        .email()
        .required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados invalidos ou incorretos' });
    }
    const { email } = req.body;
    const userExists = await User.findOne({
      where: { email },
    });
    if (userExists) {
      return res.status(400).json({ error: 'Usuario já existe' });
    }
    const user = await User.create(req.body);
    return res.json(user);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      oldPassword: Yup.string(),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required() : field
      ),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados invalidos' });
    }
    const user = await User.findByPk(req.userId);
    const { oldPassword, confirmPassword, password: newPassword } = req.body;
    if (oldPassword && !(await user.comparePassword(oldPassword))) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }
    if (confirmPassword !== newPassword) {
      return res.status(400).json({ error: 'Senhas não batem' });
    }

    if (oldPassword && oldPassword === newPassword) {
      return res
        .status(400)
        .json({ error: 'A nova senha não pode ser igual a antiga' });
    }
    const { name, provider, password } = await user.update(req.body);
    return res.json({
      name,
      password,
      provider,
    });
  }
}

export default new UserController();
