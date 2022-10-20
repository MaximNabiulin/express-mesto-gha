const User = require('../models/user');

const CREATED_STATUS_CODE = 201;
const CAST_ERROR_CODE = 400;
const NOT_FOUND_ERROR_CODE = 404;
const DEFAULT_ERROR_CODE = 500;

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.send({ data: users });
  } catch (err) {
    return res.status(DEFAULT_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь по указанному id не найден' });
    }
    return res.send({ data: user });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(CAST_ERROR_CODE).send({ message: 'Передан некорректный id пользователя' });
    }
    return res.status(DEFAULT_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.createUser = async (req, res) => {
  const { name, about, avatar } = req.body;

  try {
    const user = await User.create({ name, about, avatar });
    return res.status(CREATED_STATUS_CODE).send({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(CAST_ERROR_CODE).send({
        message: 'Переданы некорректные данные при создании пользователя',
      });
    }
    return res.status(DEFAULT_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
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
      return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь по указанному id не найден' });
    }
    return res.send({ data: user });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(CAST_ERROR_CODE).send({
        message: 'Переданы некорректные данные при обновлении профиля',
      });
    }
    return res.status(DEFAULT_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
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
      return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь по указанному id не найден' });
    }
    return res.send({ data: user });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(CAST_ERROR_CODE).send({
        message: 'Переданы некорректные данные при обновлении аватара',
      });
    }
    return res.status(DEFAULT_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
  }
};
