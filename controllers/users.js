const User = require('../models/user');

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).send({ data: users });
  } catch (err) {
    return res.status(500).send({ message: 'Ошибка по умолчанию' });
  }
};

module.exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).send({ message: 'Пользователь по указанному id не найден' });
    }
    return res.status(200).send({ data: user });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).send({ message: 'Передан некорректный id пользователя' });
    }
    return res.status(500).send({ message: 'Ошибка по умолчанию' });
  }
};

module.exports.createUser = async (req, res) => {
  const { name, about, avatar } = req.body;

  try {
    const user = await User.create({ name, about, avatar });
    return res.status(201).send({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).send({
        message: 'Переданы некорректные данные при создании пользователя',
      });
    }
    return res.status(500).send({ message: 'Ошибка по умолчанию' });
  }
};

module.exports.updateUserInfo = async (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      return res.status(404).send({ message: 'Пользователь по указанному id не найден' });
    }
    return res.status(200).send({ data: user });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).send({
        message: 'Переданы некорректные данные при обновлении профиля',
      });
    }
    return res.status(500).send({ message: 'Ошибка по умолчанию' });
  }
};

module.exports.updateUserAvatar = async (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      return res.status(404).send({ message: 'Пользователь по указанному id не найден' });
    }
    return res.status(200).send({ data: user });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).send({
        message: 'Переданы некорректные данные при обновлении аватара',
      });
    }
    return res.status(500).send({ message: 'Ошибка по умолчанию' });
  }
};
