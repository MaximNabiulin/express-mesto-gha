// const { NODE_ENV, JWT_SECRET } = process.env;

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const CastError = require('../errors/CastError');
const ValidationError = require('../errors/ValidationError');
// const AuthorizationError = require('../errors/AuthorizationError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

const CREATED_STATUS_CODE = 201;
// const CAST_ERROR_CODE = 400;
// const AUTH_ERROR_CODE = 401;
// const NOT_FOUND_ERROR_CODE = 404;
// const DEFAULT_ERROR_CODE = 500;

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        // NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        'ed971b19bc18f2a281a4810fb5aaf2e4',
        { expiresIn: '7d' },
      );
      res
        .cookie('authorization', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .end();
    })
    .catch(next);
  // .catch(next(new AuthorizationError('Ошибка Авторизации')));
  // .catch(() => {
  //   res.status(AUTH_ERROR_CODE).send({ message: 'Ошибка Авторизации' });
  // });
};

module.exports.getCurrentUser = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('Пользователь по указанному id не найден');
      // return res.status(NOT_FOUND_ERROR_CODE).send(
      //   { message: 'Пользователь по указанному id не найден' },
      // );
    }
    return res.send({ data: user });
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new CastError('Передан некорректный id пользователя'));
      // return res.status(CAST_ERROR_CODE).send(
      //   { message: 'Передан некорректный id пользователя' },
      // );
    }
    return next(err);
  }
};

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.send({ data: users });
  } catch (err) {
    return next(err);
  }
};

module.exports.getUserById = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('Пользователь по указанному id не найден');
    }
    return res.send({ data: user });
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new CastError('Передан некорректный id пользователя'));
      // return res.status(CAST_ERROR_CODE).send(
      //   { message: 'Передан некорректный id пользователя' }
      // );
    }
    return next(err);
  }
};

module.exports.createUser = async (req, res, next) => {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;

  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashPassword,
      name,
      about,
      avatar,
    });
    return res.status(CREATED_STATUS_CODE).send({
      _id: user._id,
      email: user.email,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
    });
  } catch (err) {
    // console.log(err.name);
    if (err.name === 'MongoServerError' && err.code === 11000) {
      return next(new ConflictError('Такой Email уже зарегистрирован'));
    }
    // if (err.name === 'ValidationError') {
    //   return next(new ValidationError('Переданы некорректные данные при создании пользователя'));
    //   // return res.status(CAST_ERROR_CODE).send({
    //   //   message: 'Переданы некорректные данные при создании пользователя',
    //   // });
    // }
    return next(err);
  }
};

module.exports.updateUserInfo = async (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      throw new NotFoundError('Пользователь по указанному id не найден');
      // return res.status(NOT_FOUND_ERROR_CODE).send(
      //   { message: 'Пользователь по указанному id не найден' }
      // );
    }
    return res.send({ data: user });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new ValidationError('Переданы некорректные данные при обновлении профиля'));
      // return res.status(CAST_ERROR_CODE).send({
      //   message: 'Переданы некорректные данные при обновлении профиля',
      // });
    }
    return next(err);
  }
};

module.exports.updateUserAvatar = async (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      throw new NotFoundError('Пользователь по указанному id не найден');
      // return res.status(NOT_FOUND_ERROR_CODE).send(
      //   { message: 'Пользователь по указанному id не найден' }
      // );
    }
    return res.send({ data: user });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new ValidationError('Переданы некорректные данные при обновлении аватара'));
      // return res.status(CAST_ERROR_CODE).send({
      //   message: 'Переданы некорректные данные при обновлении аватара',
      // });
    }
    return next(err);
  }
};
